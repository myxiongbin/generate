package com.auto.generate.mapper;

import java.util.List;

import com.auto.generate.code.model.MySql;


public interface MySqlMapper {
	
	/**
	 * 查询所有库表
	 * @Description: (方法职责详细描述,可空)  
	 * @Title: queryAllTableName 
	 * @param tableSchema		库表名称
	 * @return
	 * @date 2016年3月4日 下午10:07:12  
	 * @author xiongbin
	 */
	List<MySql> queryAllTableName(String tableSchema);
}