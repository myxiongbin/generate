package com.auto.generate.code.model;

import java.io.Serializable;


public class DataBase implements Serializable{

	private static final long serialVersionUID = 1L;
	
	private String url;
	private String driver;
	private String username;
	private String password;
	private String tableNameList;
	private String prjName;
    private String basepackage;
    private String namespace;
    private String outRootOverride;
    private boolean writeTableToLocal = false;
    private String dbType;
    private String dataBaseName;
    
	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getDriver() {
		return driver;
	}

	public void setDriver(String driver) {
		this.driver = driver;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getTableNameList() {
		return tableNameList;
	}

	public void setTableNameList(String tableNameList) {
		this.tableNameList = tableNameList;
	}

	public String getPrjName() {
		return prjName;
	}

	public void setPrjName(String prjName) {
		this.prjName = prjName;
	}

	public String getBasepackage() {
		return basepackage;
	}

	public void setBasepackage(String basepackage) {
		this.basepackage = basepackage;
	}

	public String getNamespace() {
		return namespace;
	}

	public void setNamespace(String namespace) {
		this.namespace = namespace;
	}

	public String getOutRootOverride() {
		return outRootOverride;
	}

	public void setOutRootOverride(String outRootOverride) {
		this.outRootOverride = outRootOverride;
	}

	public boolean isWriteTableToLocal() {
		return writeTableToLocal;
	}

	public void setWriteTableToLocal(boolean writeTableToLocal) {
		this.writeTableToLocal = writeTableToLocal;
	}

	public String getDbType() {
		return dbType;
	}

	public void setDbType(String dbType) {
		this.dbType = dbType;
	}

	public String getDataBaseName() {
		return dataBaseName;
	}

	public void setDataBaseName(String dataBaseName) {
		this.dataBaseName = dataBaseName;
	}
	
	public static DataBase getMaySql(String prjName){
		DataBase dataBase = new DataBase();
		dataBase.setUrl("192.168.125.188:3306");
		dataBase.setDriver("com.mysql.jdbc.Driver");
		dataBase.setUsername("root");
		dataBase.setPassword("mysql");
		dataBase.setTableNameList("");
		dataBase.setPrjName(prjName);
		dataBase.setBasepackage("com.system");
		dataBase.setNamespace("syetem");
		dataBase.setOutRootOverride("d:\\generator-output");
		dataBase.setWriteTableToLocal(false);
		dataBase.setDbType("mysql");
		dataBase.setDataBaseName("caitu99");
		return dataBase;
	}
	
	public static DataBase getOracle(String prjName){
		DataBase dataBase = new DataBase();
		dataBase.setUrl("192.168.105.29:1521");
		dataBase.setDriver("oracle.jdbc.driver.OracleDriver");
		dataBase.setUsername("base_system");
		dataBase.setPassword("base_system");
		dataBase.setTableNameList("sm_user;sm_role");
		dataBase.setPrjName(prjName);
		dataBase.setBasepackage("com.system");
		dataBase.setNamespace("syetem");
		dataBase.setOutRootOverride("d:\\generator-output");
		dataBase.setWriteTableToLocal(false);
		dataBase.setDbType("oracle");
		dataBase.setDataBaseName("oracle");
		return dataBase;
	}
}
