/*
 * Copyright (c) 2015-2020 by caitu99
 * All rights reserved.
 */
package com.auto.generate.code.dao;

/** 
 * @Description: (类职责详细描述,可空) 
 * @ClassName: SqlDao 
 * @author xiongbin
 * @date 2016年3月4日 下午9:18:02 
 * @Copyright (c) 2015-2020 by caitu99 
 */
public interface SqlDao {

	/**
	 * 连接数据库
	 * @Description: (方法职责详细描述,可空)  
	 * @Title: connect 
	 * @param driverClassName		数据库驱动
	 * @param url					数据库地址
	 * @param userName				数据库用户名
	 * @param password				数据库密码
	 * @date 2016年3月4日 下午9:20:39  
	 * @author xiongbin
	 */
	void connect(String driverClassName,String url,String userName,String password);
}
