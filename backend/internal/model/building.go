package model

import (
	"fmt"
	"time"

	"gorm.io/gorm"
)

// Building 楼宇模型
type Building struct {
	ID               uint           `json:"id" gorm:"primaryKey"`
	BuildingCode     string         `json:"buildingCode" gorm:"type:varchar(50);uniqueIndex;not null;comment:楼宇编号"`
	BuildingName     string         `json:"buildingName" gorm:"type:varchar(100);not null;comment:楼宇名称"`
	Address          string         `json:"address" gorm:"type:varchar(255);comment:详细地址"`
	TotalArea        float64        `json:"totalArea" gorm:"type:decimal(10,2);comment:总面积(平方米)"`
	FloorCount       int            `json:"floorCount" gorm:"comment:楼层数"`
	ConstructionDate *time.Time     `json:"constructionDate" gorm:"type:date;comment:建成日期"`
	PropertyOwner    string         `json:"propertyOwner" gorm:"type:varchar(100);comment:产权单位"`
	ManagementUnit   string         `json:"managementUnit" gorm:"type:varchar(100);comment:管理单位"`
	Longitude        float64        `json:"longitude" gorm:"type:decimal(10,7);comment:经度"`
	Latitude         float64        `json:"latitude" gorm:"type:decimal(10,7);comment:纬度"`
	Status           string         `json:"status" gorm:"type:varchar(20);default:'在用';comment:状态：在用/停用/维修"`
	Description      string         `json:"description" gorm:"type:text;comment:描述"`
	OrganizationID   uint           `json:"organizationId" gorm:"comment:所属组织ID"`
	Organization     *Organization  `json:"organization,omitempty" gorm:"foreignKey:OrganizationID"`
	Floors           []Floor        `json:"floors,omitempty" gorm:"foreignKey:BuildingID"`
	CreatedAt        time.Time      `json:"createdAt"`
	UpdatedAt        time.Time      `json:"updatedAt"`
	DeletedAt        gorm.DeletedAt `json:"-" gorm:"index"`
}

// TableName 指定表名
func (Building) TableName() string {
	return "buildings"
}

// BeforeCreate 创建前的钩子
func (b *Building) BeforeCreate(tx *gorm.DB) error {
	if b.Status == "" {
		b.Status = "在用"
	}
	// 生成楼宇编号
	if b.BuildingCode == "" {
		var count int64
		tx.Model(&Building{}).Count(&count)
		b.BuildingCode = generateBuildingCode(count + 1)
	}
	return nil
}

// generateBuildingCode 生成楼宇编号
func generateBuildingCode(seq int64) string {
	return fmt.Sprintf("B%04d", seq)
}

// BuildingStatistics 楼宇统计信息
type BuildingStatistics struct {
	TotalBuildings   int     `json:"totalBuildings"`   // 楼宇总数
	TotalArea        float64 `json:"totalArea"`        // 总面积
	TotalFloors      int     `json:"totalFloors"`      // 楼层总数
	TotalRooms       int     `json:"totalRooms"`       // 房间总数
	TotalAssets      int     `json:"totalAssets"`      // 资产总数
	TotalAssetValue  float64 `json:"totalAssetValue"`  // 资产总价值
	ActiveBuildings  int     `json:"activeBuildings"`  // 在用楼宇数
	AverageOccupancy float64 `json:"averageOccupancy"` // 平均使用率
}

// GetStatistics 获取楼宇统计信息
func (b *Building) GetStatistics(db *gorm.DB) (*BuildingStatistics, error) {
	var stats BuildingStatistics

	// 查询楼层数
	db.Model(&Floor{}).Where("building_id = ?", b.ID).Count(&stats.TotalFloors)

	// 查询房间数
	db.Model(&Room{}).
		Joins("JOIN floors ON rooms.floor_id = floors.id").
		Where("floors.building_id = ?", b.ID).
		Count(&stats.TotalRooms)

	// 查询资产数和总价值
	var result struct {
		Count int64
		Value float64
	}
	db.Model(&Asset{}).
		Select("COUNT(*) as count, COALESCE(SUM(asset_value), 0) as value").
		Joins("JOIN rooms ON assets.room_id = rooms.id").
		Joins("JOIN floors ON rooms.floor_id = floors.id").
		Where("floors.building_id = ?", b.ID).
		Scan(&result)

	stats.TotalAssets = int(result.Count)
	stats.TotalAssetValue = result.Value

	return &stats, nil
}
