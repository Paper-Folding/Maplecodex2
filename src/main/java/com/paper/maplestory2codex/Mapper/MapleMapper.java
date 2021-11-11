package com.paper.maplestory2codex.Mapper;

import com.paper.maplestory2codex.Entity.Item;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface MapleMapper {
    @Select("select * from items where Id=${id}")
    Item getSingleItem(String id);

    @Select("select Icon from items where Id=${id}")
    String getIconPath(String id);

    @Select("select * from items where Type like '%${type}%' and (Id like '%${searchStr}%' or Name like '%${searchStr}%' or Feature like '%${searchStr}%') limit ${start},${count}")
    List<Item> getItems(int start, int count, String searchStr, String type);

    @Select("select count(1) as count from items where Type like '%${type}%' and (Id like '%${searchStr}%' or Name like '%${searchStr}%' or Feature like '%${searchStr}%')")
    int countItems(int start, int count, String searchStr, String type);

    @Select("select Type from items where Type!='' group by Type order by Type")
    List<String> getTypes();
}
