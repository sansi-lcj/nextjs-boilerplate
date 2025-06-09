package v1

import (
	"net/http"
	"strconv"

	"building-asset-management/internal/model"
	"building-asset-management/internal/service"
	"building-asset-management/pkg/response"

	"github.com/gin-gonic/gin"
)

type AssetAPI struct {
	assetService *service.AssetService
}

func NewAssetAPI() *AssetAPI {
	return &AssetAPI{
		assetService: service.NewAssetService(),
	}
}

// Asset CRUD operations

// GetAssets 获取资产列表
func (a *AssetAPI) GetAssets(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "10"))
	name := c.Query("name")
	assetType := c.Query("type")
	status := c.Query("status")

	assets, total, err := a.assetService.GetAssets(page, pageSize, name, assetType, status)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "获取资产列表失败", err.Error())
		return
	}

	response.Success(c, gin.H{
		"list":      assets,
		"total":     total,
		"page":      page,
		"page_size": pageSize,
	})
}

// GetAsset 获取资产详情
func (a *AssetAPI) GetAsset(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "无效的资产ID", err.Error())
		return
	}

	asset, err := a.assetService.GetAssetByID(uint(id))
	if err != nil {
		response.Error(c, http.StatusNotFound, "资产不存在", err.Error())
		return
	}

	response.Success(c, asset)
}

// CreateAsset 创建资产
func (a *AssetAPI) CreateAsset(c *gin.Context) {
	var req model.Asset
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "请求参数错误", err.Error())
		return
	}

	userID := c.GetUint("userID")
	req.CreatedBy = userID

	asset, err := a.assetService.CreateAsset(&req)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "创建资产失败", err.Error())
		return
	}

	response.Success(c, asset)
}

// UpdateAsset 更新资产
func (a *AssetAPI) UpdateAsset(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "无效的资产ID", err.Error())
		return
	}

	var req model.Asset
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "请求参数错误", err.Error())
		return
	}

	userID := c.GetUint("userID")
	req.UpdatedBy = userID

	asset, err := a.assetService.UpdateAsset(uint(id), &req)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "更新资产失败", err.Error())
		return
	}

	response.Success(c, asset)
}

// DeleteAsset 删除资产
func (a *AssetAPI) DeleteAsset(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "无效的资产ID", err.Error())
		return
	}

	if err := a.assetService.DeleteAsset(uint(id)); err != nil {
		response.Error(c, http.StatusInternalServerError, "删除资产失败", err.Error())
		return
	}

	response.Success(c, nil)
}

// Building CRUD operations

// GetBuildings 获取建筑列表
func (a *AssetAPI) GetBuildings(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "10"))
	assetID, _ := strconv.ParseUint(c.Query("asset_id"), 10, 64)
	name := c.Query("name")

	buildings, total, err := a.assetService.GetBuildings(page, pageSize, uint(assetID), name)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "获取建筑列表失败", err.Error())
		return
	}

	response.Success(c, gin.H{
		"list":      buildings,
		"total":     total,
		"page":      page,
		"page_size": pageSize,
	})
}

// GetBuilding 获取建筑详情
func (a *AssetAPI) GetBuilding(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "无效的建筑ID", err.Error())
		return
	}

	building, err := a.assetService.GetBuildingByID(uint(id))
	if err != nil {
		response.Error(c, http.StatusNotFound, "建筑不存在", err.Error())
		return
	}

	response.Success(c, building)
}

// CreateBuilding 创建建筑
func (a *AssetAPI) CreateBuilding(c *gin.Context) {
	var req model.Building
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "请求参数错误", err.Error())
		return
	}

	userID := c.GetUint("userID")
	req.CreatedBy = userID

	building, err := a.assetService.CreateBuilding(&req)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "创建建筑失败", err.Error())
		return
	}

	response.Success(c, building)
}

// UpdateBuilding 更新建筑
func (a *AssetAPI) UpdateBuilding(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "无效的建筑ID", err.Error())
		return
	}

	var req model.Building
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "请求参数错误", err.Error())
		return
	}

	userID := c.GetUint("userID")
	req.UpdatedBy = userID

	building, err := a.assetService.UpdateBuilding(uint(id), &req)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "更新建筑失败", err.Error())
		return
	}

	response.Success(c, building)
}

// DeleteBuilding 删除建筑
func (a *AssetAPI) DeleteBuilding(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "无效的建筑ID", err.Error())
		return
	}

	if err := a.assetService.DeleteBuilding(uint(id)); err != nil {
		response.Error(c, http.StatusInternalServerError, "删除建筑失败", err.Error())
		return
	}

	response.Success(c, nil)
}

// Floor CRUD operations

// GetFloors 获取楼层列表
func (a *AssetAPI) GetFloors(c *gin.Context) {
	buildingID, _ := strconv.ParseUint(c.Query("building_id"), 10, 64)

	floors, err := a.assetService.GetFloorsByBuildingID(uint(buildingID))
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "获取楼层列表失败", err.Error())
		return
	}

	response.Success(c, floors)
}

// CreateFloor 创建楼层
func (a *AssetAPI) CreateFloor(c *gin.Context) {
	var req model.Floor
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "请求参数错误", err.Error())
		return
	}

	userID := c.GetUint("userID")
	req.CreatedBy = userID

	floor, err := a.assetService.CreateFloor(&req)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "创建楼层失败", err.Error())
		return
	}

	response.Success(c, floor)
}

// UpdateFloor 更新楼层
func (a *AssetAPI) UpdateFloor(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "无效的楼层ID", err.Error())
		return
	}

	var req model.Floor
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "请求参数错误", err.Error())
		return
	}

	userID := c.GetUint("userID")
	req.UpdatedBy = userID

	floor, err := a.assetService.UpdateFloor(uint(id), &req)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "更新楼层失败", err.Error())
		return
	}

	response.Success(c, floor)
}

// DeleteFloor 删除楼层
func (a *AssetAPI) DeleteFloor(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "无效的楼层ID", err.Error())
		return
	}

	if err := a.assetService.DeleteFloor(uint(id)); err != nil {
		response.Error(c, http.StatusInternalServerError, "删除楼层失败", err.Error())
		return
	}

	response.Success(c, nil)
}

// Room CRUD operations

// GetRooms 获取房间列表
func (a *AssetAPI) GetRooms(c *gin.Context) {
	floorID, _ := strconv.ParseUint(c.Query("floor_id"), 10, 64)

	rooms, err := a.assetService.GetRoomsByFloorID(uint(floorID))
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "获取房间列表失败", err.Error())
		return
	}

	response.Success(c, rooms)
}

// CreateRoom 创建房间
func (a *AssetAPI) CreateRoom(c *gin.Context) {
	var req model.Room
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "请求参数错误", err.Error())
		return
	}

	userID := c.GetUint("userID")
	req.CreatedBy = userID

	room, err := a.assetService.CreateRoom(&req)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "创建房间失败", err.Error())
		return
	}

	response.Success(c, room)
}

// UpdateRoom 更新房间
func (a *AssetAPI) UpdateRoom(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "无效的房间ID", err.Error())
		return
	}

	var req model.Room
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "请求参数错误", err.Error())
		return
	}

	userID := c.GetUint("userID")
	req.UpdatedBy = userID

	room, err := a.assetService.UpdateRoom(uint(id), &req)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "更新房间失败", err.Error())
		return
	}

	response.Success(c, room)
}

// DeleteRoom 删除房间
func (a *AssetAPI) DeleteRoom(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "无效的房间ID", err.Error())
		return
	}

	if err := a.assetService.DeleteRoom(uint(id)); err != nil {
		response.Error(c, http.StatusInternalServerError, "删除房间失败", err.Error())
		return
	}

	response.Success(c, nil)
}

// GetAssetStatistics 获取资产统计数据
func (a *AssetAPI) GetAssetStatistics(c *gin.Context) {
	stats, err := a.assetService.GetAssetStatistics()
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "获取统计数据失败", err.Error())
		return
	}

	response.Success(c, stats)
}
