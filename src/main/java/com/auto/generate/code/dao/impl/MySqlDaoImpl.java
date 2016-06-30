package com.auto.generate.code.dao.impl;

import java.util.List;

import org.apache.commons.dbcp.BasicDataSource;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.auto.generate.code.dao.MySqlDao;
import com.auto.generate.code.model.Table;
import com.auto.generate.mapper.MySqlMapper;

/** 
 * @Description: (类职责详细描述,可空) 
 * @ClassName: MySqlDao 
 * @author xiongbin
 * @date 2016年3月4日 下午4:51:05 
 * @Copyright (c) 2015-2020 by caitu99 
 */
@Repository("mySqlDao")
public class MySqlDaoImpl implements MySqlDao{

	@Autowired
	private BasicDataSource basicDataSource;
	@Autowired
	private SqlSession sqlSession;
	
	@Override
	public void connect(String driverClassName, String url, String userName,String password) {
		basicDataSource.setDriverClassName(driverClassName);
		basicDataSource.setUrl(url);
		basicDataSource.setUsername(userName);
		basicDataSource.setPassword(password);
	}
	
	@Override
	public List<Table> queryAllTableName(String tableSchema) {
		return sqlSession.getMapper(MySqlMapper.class).queryAllTableName(tableSchema);
	}

	
}
