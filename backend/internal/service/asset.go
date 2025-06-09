package service

import (
	"errors"
	"fmt"

	"building-asset-backend/internal/model"
	"building-asset-backend/pkg/database"

	"gorm.io/gorm"
)

type AssetService struct {
	db *gorm.DB
}

func NewAssetService() *AssetService {
	return &AssetService{
		db: database.GetDB(),
	}
}

// Asset operations

func (s *AssetService) GetAssets(page, pageSize int, name, assetType, status string) ([]*model.Asset, int64, error) {
	var assets []*model.Asset
	var total int64

	query := s.db.Model(&model.Asset{})

	if name != "" {
		query = query.Where("asset_name LIKE ?", "%"+name+"%")
	}
	if assetType != "" {
		query = query.Where("type = ?", assetType)
	}
	if status != "" {
		query = query.Where("status = ?", status)
	}

	err := query.Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	offset := (page - 1) * pageSize
	err = query.Preload("Buildings").Offset(offset).Limit(pageSize).Find(&assets).Error
	if err != nil {
		return nil, 0, err
	}

	return assets, total, nil
}

func (s *AssetService) GetAssetByID(id uint) (*model.Asset, error) {
	var asset model.Asset
	err := s.db.Preload("Buildings.Floors.Rooms").First(&asset, id).Error
	if err != nil {
		return nil, err
	}
	return &asset, nil
}

func (s *AssetService) CreateAsset(asset *model.Asset) (*model.Asset, error) {
	// 检查名称是否重复
	var count int64
	s.db.Model(&model.Asset{}).Where("asset_name = ?", asset.AssetName).Count(&count)
	if count > 0 {
		return nil, errors.New("资产名称已存在")
	}

	if err := s.db.Create(asset).Error; err != nil {
		return nil, err
	}
	return asset, nil
}

func (s *AssetService) UpdateAsset(id uint, updates *model.Asset) (*model.Asset, error) {
	var asset model.Asset
	if err := s.db.First(&asset, id).Error; err != nil {
		return nil, err
	}

	// 检查名称是否重复
	if updates.AssetName != "" && updates.AssetName != asset.AssetName {
		var count int64
		s.db.Model(&model.Asset{}).Where("asset_name = ? AND id != ?", updates.AssetName, id).Count(&count)
		if count > 0 {
			return nil, errors.New("资产名称已存在")
		}
	}

	if err := s.db.Model(&asset).Updates(updates).Error; err != nil {
		return nil, err
	}

	return &asset, nil
}

func (s *AssetService) DeleteAsset(id uint) error {
	// 检查是否有关联的建筑
	var count int64
	s.db.Model(&model.Building{}).Where("asset_id = ?", id).Count(&count)
	if count > 0 {
		return errors.New("该资产下存在建筑，无法删除")
	}

	return s.db.Delete(&model.Asset{}, id).Error
}

// Building operations

func (s *AssetService) GetBuildings(page, pageSize int, assetID uint, name string) ([]*model.Building, int64, error) {
	var buildings []*model.Building
	var total int64

	query := s.db.Model(&model.Building{})

	if assetID > 0 {
		query = query.Where("asset_id = ?", assetID)
	}
	if name != "" {
		query = query.Where("building_name LIKE ?", "%"+name+"%")
	}

	err := query.Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	offset := (page - 1) * pageSize
	err = query.Preload("Asset").Preload("Floors").Offset(offset).Limit(pageSize).Find(&buildings).Error
	if err != nil {
		return nil, 0, err
	}

	return buildings, total, nil
}

func (s *AssetService) GetBuildingByID(id uint) (*model.Building, error) {
	var building model.Building
	err := s.db.Preload("Asset").Preload("Floors.Rooms").First(&building, id).Error
	if err != nil {
		return nil, err
	}
	return &building, nil
}

func (s *AssetService) CreateBuilding(building *model.Building) (*model.Building, error) {
	// 验证资产是否存在
	var asset model.Asset
	if err := s.db.First(&asset, building.AssetID).Error; err != nil {
		return nil, errors.New("资产不存在")
	}

	// 检查名称是否重复
	var count int64
	s.db.Model(&model.Building{}).Where("asset_id = ? AND building_name = ?", building.AssetID, building.BuildingName).Count(&count)
	if count > 0 {
		return nil, errors.New("该资产下建筑名称已存在")
	}

	if err := s.db.Create(building).Error; err != nil {
		return nil, err
	}
	return building, nil
}

func (s *AssetService) UpdateBuilding(id uint, updates *model.Building) (*model.Building, error) {
	var building model.Building
	if err := s.db.First(&building, id).Error; err != nil {
		return nil, err
	}

	// 检查名称是否重复
	if updates.BuildingName != "" && updates.BuildingName != building.BuildingName {
		var count int64
		s.db.Model(&model.Building{}).Where("asset_id = ? AND building_name = ? AND id != ?", building.AssetID, updates.BuildingName, id).Count(&count)
		if count > 0 {
			return nil, errors.New("该资产下建筑名称已存在")
		}
	}

	if err := s.db.Model(&building).Updates(updates).Error; err != nil {
		return nil, err
	}

	return &building, nil
}

func (s *AssetService) DeleteBuilding(id uint) error {
	// 检查是否有关联的楼层
	var count int64
	s.db.Model(&model.Floor{}).Where("building_id = ?", id).Count(&count)
	if count > 0 {
		return errors.New("该建筑下存在楼层，无法删除")
	}

	return s.db.Delete(&model.Building{}, id).Error
}

// Floor operations

func (s *AssetService) GetFloorsByBuildingID(buildingID uint) ([]*model.Floor, error) {
	var floors []*model.Floor
	err := s.db.Where("building_id = ?", buildingID).Order("floor_number").Find(&floors).Error
	if err != nil {
		return nil, err
	}
	return floors, nil
}

func (s *AssetService) CreateFloor(floor *model.Floor) (*model.Floor, error) {
	// 验证建筑是否存在
	var building model.Building
	if err := s.db.First(&building, floor.BuildingID).Error; err != nil {
		return nil, errors.New("建筑不存在")
	}

	// 检查楼层号是否重复
	var count int64
	s.db.Model(&model.Floor{}).Where("building_id = ? AND floor_number = ?", floor.BuildingID, floor.FloorNumber).Count(&count)
	if count > 0 {
		return nil, errors.New("该建筑下楼层号已存在")
	}

	if err := s.db.Create(floor).Error; err != nil {
		return nil, err
	}
	return floor, nil
}

func (s *AssetService) UpdateFloor(id uint, updates *model.Floor) (*model.Floor, error) {
	var floor model.Floor
	if err := s.db.First(&floor, id).Error; err != nil {
		return nil, err
	}

	// 检查楼层号是否重复
	if updates.FloorNumber > 0 && updates.FloorNumber != floor.FloorNumber {
		var count int64
		s.db.Model(&model.Floor{}).Where("building_id = ? AND floor_number = ? AND id != ?", floor.BuildingID, updates.FloorNumber, id).Count(&count)
		if count > 0 {
			return nil, errors.New("该建筑下楼层号已存在")
		}
	}

	if err := s.db.Model(&floor).Updates(updates).Error; err != nil {
		return nil, err
	}

	return &floor, nil
}

func (s *AssetService) DeleteFloor(id uint) error {
	// 检查是否有关联的房间
	var count int64
	s.db.Model(&model.Room{}).Where("floor_id = ?", id).Count(&count)
	if count > 0 {
		return errors.New("该楼层下存在房间，无法删除")
	}

	return s.db.Delete(&model.Floor{}, id).Error
}

// Room operations

func (s *AssetService) GetRoomsByFloorID(floorID uint) ([]*model.Room, error) {
	var rooms []*model.Room
	err := s.db.Where("floor_id = ?", floorID).Order("room_number").Find(&rooms).Error
	if err != nil {
		return nil, err
	}
	return rooms, nil
}

func (s *AssetService) CreateRoom(room *model.Room) (*model.Room, error) {
	// 验证楼层是否存在
	var floor model.Floor
	if err := s.db.First(&floor, room.FloorID).Error; err != nil {
		return nil, errors.New("楼层不存在")
	}

	// 检查房间号是否重复
	var count int64
	s.db.Model(&model.Room{}).Where("floor_id = ? AND room_number = ?", room.FloorID, room.RoomNumber).Count(&count)
	if count > 0 {
		return nil, errors.New("该楼层下房间号已存在")
	}

	if err := s.db.Create(room).Error; err != nil {
		return nil, err
	}
	return room, nil
}

func (s *AssetService) UpdateRoom(id uint, updates *model.Room) (*model.Room, error) {
	var room model.Room
	if err := s.db.First(&room, id).Error; err != nil {
		return nil, err
	}

	// 检查房间号是否重复
	if updates.RoomNumber != "" && updates.RoomNumber != room.RoomNumber {
		var count int64
		s.db.Model(&model.Room{}).Where("floor_id = ? AND room_number = ? AND id != ?", room.FloorID, updates.RoomNumber, id).Count(&count)
		if count > 0 {
			return nil, errors.New("该楼层下房间号已存在")
		}
	}

	if err := s.db.Model(&room).Updates(updates).Error; err != nil {
		return nil, err
	}

	return &room, nil
}

func (s *AssetService) DeleteRoom(id uint) error {
	return s.db.Delete(&model.Room{}, id).Error
}

// Statistics

func (s *AssetService) GetAssetStatistics() (map[string]interface{}, error) {
	stats := make(map[string]interface{})

	// 资产统计
	var assetStats []struct {
		Type   string `json:"type"`
		Count  int64  `json:"count"`
		Status string `json:"status"`
	}

	s.db.Model(&model.Asset{}).
		Select("type, status, count(*) as count").
		Group("type, status").
		Find(&assetStats)

	// 建筑统计
	var buildingCount int64
	s.db.Model(&model.Building{}).Count(&buildingCount)

	// 楼层统计
	var floorCount int64
	s.db.Model(&model.Floor{}).Count(&floorCount)

	// 房间统计
	var roomStats []struct {
		Type  string `json:"type"`
		Count int64  `json:"count"`
	}
	s.db.Model(&model.Room{}).
		Select("type, count(*) as count").
		Group("type").
		Find(&roomStats)

	// 面积统计
	var totalArea struct {
		BuildingArea float64 `json:"building_area"`
		RoomArea     float64 `json:"room_area"`
	}
	s.db.Model(&model.Building{}).Select("sum(floor_area) as building_area").Find(&totalArea)
	s.db.Model(&model.Room{}).Select("sum(area) as room_area").Find(&totalArea.RoomArea)

	// 使用率统计
	var occupiedRooms int64
	s.db.Model(&model.Room{}).Where("status = ?", "occupied").Count(&occupiedRooms)

	var totalRooms int64
	s.db.Model(&model.Room{}).Count(&totalRooms)

	occupancyRate := float64(0)
	if totalRooms > 0 {
		occupancyRate = float64(occupiedRooms) / float64(totalRooms) * 100
	}

	stats["assets"] = assetStats
	stats["building_count"] = buildingCount
	stats["floor_count"] = floorCount
	stats["room_stats"] = roomStats
	stats["total_area"] = totalArea
	stats["occupancy_rate"] = fmt.Sprintf("%.2f%%", occupancyRate)

	return stats, nil
}
