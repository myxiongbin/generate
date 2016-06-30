/*
 * Copyright (c) 2015-2020 by caitu99
 * All rights reserved.
 */
package com.auto.generate.code.adapt;

import java.util.List;

import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

import com.auto.generate.code.model.Table;
import com.auto.generate.code.service.SqlService;

/** 
 * @Description: (类职责详细描述,可空) 
 * @ClassName: SqlAdapt 
 * @author xiongbin
 * @date 2016年6月30日 上午11:08:52 
 * @Copyright (c) 2015-2020 by caitu99 
 */
@Component
public class SqlAdapt implements ApplicationContextAware,SqlService{

	private ApplicationContext applicationContext;
	
	@Override
	public void setApplicationContext(ApplicationContext applicationContext)throws BeansException {
		this.applicationContext = applicationContext;
	}

	@Override
	public void connect(String dbType,String driverClassName, String url, String userName,String password,String dataBaseName) {
		SqlService sqlService = applicationContext.getBean(dbType,SqlService.class);
		sqlService.connect(dbType, driverClassName, url, userName, password,dataBaseName);
	}

	@Override
	public List<Table> queryAllTableName(String dbType,String tableSchema) {
		SqlService sqlService = applicationContext.getBean(dbType,SqlService.class);
		return sqlService.queryAllTableName(dbType, tableSchema);
	}
}
