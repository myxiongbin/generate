package com.auto.generate.code.service.impl;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.auto.generate.code.dao.MySqlDao;
import com.auto.generate.code.model.MySql;
import com.auto.generate.code.service.MySqlService;

@Service
public class MySqlServiceImpl implements MySqlService {

	private Logger log = Logger.getLogger(getClass());
	
	@Autowired
	private MySqlDao mySqlDao;

	@Override
	public void connect(String driverClassName, String url, String userName,String password) {
		mySqlDao.connect(driverClassName, url, userName, password);
	}

	@Override
	public List<MySql> queryAllTableName(String tableSchema) {
		return mySqlDao.queryAllTableName(tableSchema);
	}

}
