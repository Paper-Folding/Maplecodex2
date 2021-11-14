package com.paper.maplestory2codex.Mapper;

import com.paper.maplestory2codex.Entity.Item;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

@Mapper
public interface MapleMapper {
    @Select("select * from items where Id=${id}")
    Item getSingleItem(String id);

    @Select("select Icon from items where Id=${id}")
    String getIconPath(String id);

    @Select("select * from items where Type like concat('%',#{type},'%') and Slot like concat('%',#{slot},'%') and Favourited like concat('%',#{fav},'%') and (Id like concat('%',#{searchStr},'%') or Name like concat('%',#{searchStr},'%') or Feature like concat('%',#{searchStr},'%')) limit ${start},${count}")
    List<Item> getItems(int start, int count, String searchStr, String type, String slot, String fav);

    @Select("select count(1) as count from items where Type like concat('%',#{type},'%') and Slot like concat('%',#{slot},'%') and Favourited like concat('%',#{fav},'%') and (Id like concat('%',#{searchStr},'%') or Name like concat('%',#{searchStr},'%') or Feature like concat('%',#{searchStr},'%'))")
    int countItems(int start, int count, String searchStr, String type, String slot, String fav);

    @Select("select Type from items where Type!='' group by Type order by Type")
    List<String> getTypes();

    @Select("select Slot from items where Slot != '' group by Slot order by Slot")
    List<String> getSlots();

    @Update("update items set Favourited = (case when Favourited='0' then '1' else '0' end) where Id=${id}")
    int toggleFavoriteForSingleItem(String id);
}
