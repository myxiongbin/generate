/*
 * Copyright (c) 2015-2020 by caitu99
 * All rights reserved.
 */
package com.auto.generate.base;

import org.apache.commons.dbcp.BasicDataSource;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.auto.generate.exception.CodeException;

/** 
 * @Description: (类职责详细描述,可空) 
 * @ClassName: ConnectAop 
 * @author xiongbin
 * @date 2016年3月7日 下午5:22:28 
 * @Copyright (c) 2015-2020 by caitu99 
 */
@Component
public class ConnectAop {

	@Autowired
	private BasicDataSource basicDataSource;
	
	/**
	 * 是否连接数据库
	 * @Description: (方法职责详细描述,可空)  
	 * @Title: isConnect 
	 * @date 2016年3月7日 下午5:25:01  
	 * @author xiongbin
	 * @throws Exception 
	 */
	public void isConnect() throws CodeException {
		String driverClassName = basicDataSource.getDriverClassName();
		String url = basicDataSource.getUrl();
		String userName = basicDataSource.getUsername();
		String password = basicDataSource.getPassword();
		
		if(StringUtils.isBlank(driverClassName) || StringUtils.isBlank(url) 
							|| StringUtils.isBlank(userName) || StringUtils.isBlank(password)){
			throw new CodeException("请先连接数据库");
		}
	}
}
