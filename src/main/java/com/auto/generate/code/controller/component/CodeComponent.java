package com.auto.generate.code.controller.component;

import java.io.File;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Component;

import com.auto.generate.base.ApiResult;
import com.auto.generate.code.model.ConfigFiles;
import com.auto.generate.code.model.DataBase;
import com.auto.generate.utils.file.FileNIOCommon;
import com.auto.generate.utils.file.PropertiesUtil;
import com.thoughtworks.xstream.XStream;

@Component
public class CodeComponent {

	private Logger logger = Logger.getLogger(getClass());
	
	/** 配置文件地址 */
	private final static String configPath = PropertiesUtil.getContexrtParam("configPath");
	/** 配置文件文件夹名 */
	private final static String projectName = PropertiesUtil.getContexrtParam("projectName");
	private final static File projectFile = new File(configPath + File.separator + projectName);
	/** 项目列表文件名 */
	private final static String nameConfig = PropertiesUtil.getContexrtParam("nameConfig");
	private final static File nameConfigFile = new File(projectFile.getPath() + File.separator + nameConfig);
	
	/**
	 * 新建配置文件
	 * @Description: (方法职责详细描述,可空)  
	 * @Title: newConfigNameXml 
	 * @param newConfigName		新配置文件名
	 * @return
	 * @date 2016年3月8日 下午6:13:14  
	 * @author xiongbin
	 */
	@SuppressWarnings("unchecked")
	public String newConfigNameXml(String newConfigName) {
		ApiResult<String> result = new ApiResult<String>();
		
		try {
			if(!projectFile.exists()){
				projectFile.mkdirs();
				logger.info("创建项目文件夹成功");
			}else{
				logger.info("项目文件已存在");
			}
			
			File newConfigFile = new File(projectFile.getPath() + File.separator +  newConfigName);
			if(!newConfigFile.exists()){
				newConfigFile.mkdirs();
				logger.info("创建配置文件夹成功");
//				List<DataBase> dataBaseList = new ArrayList<DataBase>(); 
				DataBase dataBase = DataBase.getMaySql(newConfigName);
//				dataBaseList.add(dataBase);
				boolean flag = this.createConfigXml(dataBase,newConfigFile.getPath() 
																			+ File.separator + newConfigName + "_map"+ ".xml");
				
				if(flag){
					if(!nameConfigFile.exists()){
						nameConfigFile.createNewFile();
						List<ConfigFiles> nameConfigList = ConfigFiles.getDefaultConfigList(-1,"-----请选择-----",true);
						ConfigFiles nameConfig = ConfigFiles.getDefaultConfig(0,newConfigName,false);
						nameConfigList.add(nameConfig);
						flag = this.createConfigXml(nameConfigList,nameConfigFile.getPath());
						if(flag){
							logger.info("创建配置文件xml成功");
						}else{
							logger.error("创建配置文件xml失败");
							return result.toJSONString(-1, "创建配置文件xml失败");
						}
					}else{
						logger.info("配置文件xml已存在,更新数据");
						
						XStream localXStream = new XStream();
						String xmlString = FileNIOCommon.readFileToString(nameConfigFile.getPath());
						List<ConfigFiles> nameConfigList = (List<ConfigFiles>)(localXStream.fromXML((xmlString)));
						ConfigFiles configFiles = nameConfigList.get(nameConfigList.size()-1);
						Integer id = configFiles.getId();
						ConfigFiles newNameConfig = ConfigFiles.getDefaultConfig(++id,newConfigName,false);
						nameConfigList.add(newNameConfig);
						flag = this.createConfigXml(nameConfigList,nameConfigFile.getPath());
						if(flag){
							logger.info("更新配置文件xml数据成功");
						}else{
							logger.error("更新配置文件xml数据失败");
							return result.toJSONString(-1, "更新配置文件xml数据失败");
						}
					}
				}else{
					logger.error("创建项目配置文件xml出错");
					return result.toJSONString(-1, "创建项目配置文件xml出错");
				}
			}else{
				logger.info("配置文件夹已存在");
				return result.toJSONString(-1, "配置已存在");
			}
		} catch (Exception e) {
			logger.error("新建配置文件出错：" + e.getMessage(),e);
			return result.toJSONString(-1, "新建配置文件出错：" + e.getMessage());
		}
		
		return result.toJSONString(0, "创建成功");
	}
	
	/**
	 * 获取配置文件
	 * @Description: (方法职责详细描述,可空)  
	 * @Title: getNameConfigXml 
	 * @param configPath
	 * @return
	 * @date 2016年6月27日 下午6:22:45  
	 * @author xiongbin
	 */
	@SuppressWarnings("unchecked")
	public String getNameConfigXml() {
		ApiResult<List<ConfigFiles>> result = new ApiResult<List<ConfigFiles>>();
		try {
			if(!nameConfigFile.exists()){
				return result.toJSONString(0, "",ConfigFiles.getDefaultConfigList(-1,"-----请选择-----",true));
			}
			
			XStream localXStream = new XStream();
			String xmlString = FileNIOCommon.readFileToString(nameConfigFile.getPath());
			List<ConfigFiles> nameConfigList = (List<ConfigFiles>)(localXStream.fromXML((xmlString)));
			
			if(null == nameConfigList || nameConfigList.size() < 1){
				nameConfigList = ConfigFiles.getDefaultConfigList(-1,"-----请选择-----",true);
			}
			
			return result.toJSONString(0, "",nameConfigList);
		} catch (Exception e) {
			logger.error(e);
			return result.toJSONString(-1, "获取配置文件失败:" + e.getMessage());
		}
	}

	/**
	 * 读取配置文件信息
	 * @Description: (方法职责详细描述,可空)  
	 * @Title: readConfig 
	 * @param name		配置文件名称
	 * @return
	 * @date 2016年6月28日 下午4:48:52  
	 * @author xiongbin
	 */
	public String readConfig(String name) {
		ApiResult<DataBase> result = new ApiResult<DataBase>();
		
		try {
			File file = new File(projectFile.getPath() + File.separator + name + File.separator + name + "_map" + ".xml");
			
			if(file.exists()){
				XStream localXStream = new XStream();
				String xmlString = FileNIOCommon.readFileToString(file.getPath());
				DataBase dataBase = (DataBase)localXStream.fromXML(xmlString);
				
				return result.toJSONString(0, "",dataBase);
			}else{
				logger.info("配置文件未存在");
				return result.toJSONString(-1, "配置文件未存在");
			}
		} catch (Exception e) {
			logger.error("读取配置文件信息出错:" + e.getMessage(),e);
			return result.toJSONString(-1, "读取配置文件信息出错:" + e.getMessage());
		}
	}
	
	/**
	 * 创建xml文件
	 * @Description: (方法职责详细描述,可空)  
	 * @Title: createConfigXml 
	 * @param list			集合列表
	 * @param path			创建路径
	 * @return
	 * @date 2016年6月27日 下午2:56:27  
	 * @author xiongbin
	 * @param <T>
	 */
	private <T> boolean createConfigXml(List<T> list, String path) {
		try {
			XStream localXStream = new XStream();
			FileNIOCommon.writeStringToFile(path, localXStream.toXML(list), false);
			return true;
		} catch (Exception e) {
			logger.error("创建配置文件失败:" + e.getMessage(), e);
			return false;
		}
	}
	
	/**
	 * 创建xml文件
	 * @Description: (方法职责详细描述,可空)  
	 * @Title: createConfigXml 
	 * @param obj			
	 * @param path			创建路径
	 * @return
	 * @date 2016年6月27日 下午2:56:27  
	 * @author xiongbin
	 * @param <T>
	 */
	private <T> boolean createConfigXml(T obj, String path) {
		try {
			XStream localXStream = new XStream();
			FileNIOCommon.writeStringToFile(path, localXStream.toXML(obj), false);
			return true;
		} catch (Exception e) {
			logger.error("创建配置文件失败:" + e.getMessage(), e);
			return false;
		}
	}
}
