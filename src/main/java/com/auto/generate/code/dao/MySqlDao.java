/*
 * Copyright (c) 2015-2020 by caitu99
 * All rights reserved.
 */
package com.auto.generate.code.dao;

import java.util.List;

import com.auto.generate.code.model.Table;



/** 
 * @Description: (类职责详细描述,可空) 
 * @ClassName: MySqlDao 
 * @author xiongbin
 * @date 2016年3月4日 下午4:51:05 
 * @Copyright (c) 2015-2020 by caitu99 
 */
public interface MySqlDao extends SqlDao{

	/**
	 * 查询所有库表
	 * @Description: (方法职责详细描述,可空)  
	 * @Title: queryAllTableName 
	 * @param tableSchema			库名
	 * @return
	 * @date 2016年3月4日 下午10:30:53  
	 * @author xiongbin
	 */
	List<Table> queryAllTableName(String tableSchema);
}
