package model

import (
	"database/sql/driver"
	"encoding/json"
	"fmt"
)

// Asset 资产模型
type Asset struct {
	AuditModel
	AssetCode    string    `gorm:"uniqueIndex;size:50;not null" json:"asset_code"`  // 资产编码
	AssetName    string    `gorm:"size:100;not null;index" json:"asset_name"`      // 资产名称
	StreetID     uint      `gorm:"index;not null" json:"street_id"`                // 街道ID
	Address      string    `gorm:"size:200" json:"address"`                        // 详细地址
	Longitude    float64   `json:"longitude"`                                       // 经度
	Latitude     float64   `json:"latitude"`                                        // 纬度
	LandNature   string    `gorm:"size:50" json:"land_nature"`                     // 土地性质
	TotalArea    float64   `json:"total_area"`                                      // 总面积(平方米)
	RentableArea float64   `json:"rentable_area"`                                   // 可租赁面积(平方米)
	AssetTags    StringArray `gorm:"type:json" json:"asset_tags"`                    // 资产标签
	Description  string    `gorm:"type:text" json:"description"`                    // 描述
	Status       string    `gorm:"size:20;default:'normal'" json:"status"`          // 状态：normal-正常，disabled-禁用
	Street       *Organization `gorm:"foreignKey:StreetID" json:"street,omitempty"`  // 街道信息
	Buildings    []Building `gorm:"foreignKey:AssetID" json:"buildings,omitempty"`  // 楼宇列表
}

// TableName 设置表名
func (Asset) TableName() string {
	return "t_asset"
}

// Building 楼宇模型
type Building struct {
	AuditModel
	BuildingCode      string     `gorm:"uniqueIndex;size:50;not null" json:"building_code"`      // 楼宇编码
	BuildingName      string     `gorm:"size:100;not null;index" json:"building_name"`          // 楼宇名称
	AssetID           uint       `gorm:"index;not null" json:"asset_id"`                        // 资产ID
	BuildingType      string     `gorm:"size:50" json:"building_type"`                          // 楼宇类型
	TotalFloors       int        `json:"total_floors"`                                           // 总楼层数
	UndergroundFloors int        `json:"underground_floors"`                                     // 地下楼层数
	TotalArea         float64    `json:"total_area"`                                             // 总面积(平方米)
	RentableArea      float64    `json:"rentable_area"`                                          // 可租赁面积(平方米)
	ConstructionYear  string     `gorm:"size:10" json:"construction_year"`                       // 建造年份
	ElevatorCount     int        `json:"elevator_count"`                                         // 电梯数量
	ParkingSpaces     int        `json:"parking_spaces"`                                         // 停车位数量
	GreenRate         float64    `json:"green_rate"`                                             // 绿化率(%)
	PropertyCompany   string     `gorm:"size:100" json:"property_company"`                       // 物业公司
	PropertyPhone     string     `gorm:"size:20" json:"property_phone"`                          // 物业电话
	Features          StringArray `gorm:"type:json" json:"features"`                             // 配套设施
	Description       string     `gorm:"type:text" json:"description"`                           // 描述
	Status            string     `gorm:"size:20;default:'normal'" json:"status"`                 // 状态
	Asset             *Asset     `gorm:"foreignKey:AssetID" json:"asset,omitempty"`             // 资产信息
	Floors            []Floor    `gorm:"foreignKey:BuildingID" json:"floors,omitempty"`          // 楼层列表
}

// TableName 设置表名
func (Building) TableName() string {
	return "t_building"
}

// Floor 楼层模型
type Floor struct {
	AuditModel
	BuildingID       uint      `gorm:"index;not null" json:"building_id"`              // 楼宇ID
	FloorNumber      int       `gorm:"index" json:"floor_number"`                      // 楼层号
	FloorName        string    `gorm:"size:50" json:"floor_name"`                      // 楼层名称
	FloorArea        float64   `json:"floor_area"`                                      // 楼层面积(平方米)
	RentableArea     float64   `json:"rentable_area"`                                   // 可租赁面积(平方米)
	RentedArea       float64   `json:"rented_area"`                                     // 已租赁面积(平方米)
	AvgRentPrice     float64   `json:"avg_rent_price"`                                  // 平均租金(元/平方米/月)
	OccupancyRate    float64   `json:"occupancy_rate"`                                  // 出租率(%)
	Description      string    `gorm:"type:text" json:"description"`                    // 描述
	Status           string    `gorm:"size:20;default:'normal'" json:"status"`          // 状态
	Building         *Building `gorm:"foreignKey:BuildingID" json:"building,omitempty"` // 楼宇信息
	Rooms            []Room    `gorm:"foreignKey:FloorID" json:"rooms,omitempty"`       // 房间列表
}

// TableName 设置表名
func (Floor) TableName() string {
	return "t_floor"
}

// Room 房间模型
type Room struct {
	AuditModel
	FloorID       uint    `gorm:"index;not null" json:"floor_id"`           // 楼层ID
	RoomNumber    string  `gorm:"size:50;index" json:"room_number"`         // 房间号
	RoomType      string  `gorm:"size:50" json:"room_type"`                 // 房间类型：office-办公室，meeting-会议室，other-其他
	RoomArea      float64 `json:"room_area"`                                 // 房间面积(平方米)
	RentPrice     float64 `json:"rent_price"`                                // 租金(元/月)
	Decoration    string  `gorm:"size:50" json:"decoration"`                 // 装修情况：blank-毛坯，simple-简装，luxury-精装
	Orientation   string  `gorm:"size:50" json:"orientation"`                // 朝向：east-东，south-南，west-西，north-北
	HasWindow     bool    `json:"has_window"`                                // 是否有窗
	HasAC         bool    `json:"has_ac"`                                    // 是否有空调
	Description   string  `gorm:"type:text" json:"description"`              // 描述
	Status        string  `gorm:"size:20;default:'available'" json:"status"` // 状态：available-可租，rented-已租，maintenance-维护中
	Floor         *Floor  `gorm:"foreignKey:FloorID" json:"floor,omitempty"` // 楼层信息
}

// TableName 设置表名
func (Room) TableName() string {
	return "t_room"
}

// Street 街道模型（组织表的视图）
type Street struct {
	ID   uint   `json:"id"`
	Name string `json:"name"`
	Code string `json:"code"`
}

// StringArray 自定义类型，用于存储JSON数组
type StringArray []string

// Value 实现driver.Valuer接口
func (s StringArray) Value() (driver.Value, error) {
	if s == nil {
		return "[]", nil
	}
	return json.Marshal(s)
}

// Scan 实现sql.Scanner接口
func (s *StringArray) Scan(value interface{}) error {
	if value == nil {
		*s = []string{}
		return nil
	}
	
	switch v := value.(type) {
	case []byte:
		return json.Unmarshal(v, s)
	case string:
		return json.Unmarshal([]byte(v), s)
	default:
		return fmt.Errorf("cannot scan type %T into StringArray", value)
	}
}