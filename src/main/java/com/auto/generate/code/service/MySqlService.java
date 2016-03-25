package com.auto.generate.code.service;

import java.util.List;

import com.auto.generate.code.model.MySql;


public interface MySqlService {
	
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
	void connect(String driverClassName, String url, String userName,String password);
	
	/**
	 * 查询所有库表
	 * @Description: (方法职责详细描述,可空)  
	 * @Title: queryTableName 
	 * @param tableSchema			库名
	 * @return
	 * @date 2016年3月4日 下午10:30:53  
	 * @author xiongbin
	 */
	List<MySql> queryTableName(String tableSchema);
}
