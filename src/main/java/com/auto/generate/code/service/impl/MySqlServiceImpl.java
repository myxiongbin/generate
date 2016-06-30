package com.auto.generate.code.service.impl;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.auto.generate.code.dao.MySqlDao;
import com.auto.generate.code.model.Table;
import com.auto.generate.code.service.SqlService;

@Service("mysql")
public class MySqlServiceImpl implements SqlService {

	private Logger log = Logger.getLogger(getClass());
	
	@Autowired
	private MySqlDao mySqlDao;

	@Override
	public void connect(String dbType,String driverClassName, String url, String userName,String password,String dataBaseName) {
		//jdbc:mysql://192.168.25.188:3306/caitu99
		url = "jdbc:" + dbType + "://" + url + "/" + dataBaseName;
		mySqlDao.connect(driverClassName, url, userName, password);
	}

	@Override
	public List<Table> queryAllTableName(String dbType,String tableSchema) {
		return mySqlDao.queryAllTableName(tableSchema);
	}
}
