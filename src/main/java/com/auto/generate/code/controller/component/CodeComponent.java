package com.auto.generate.code.controller.component;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Component;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.auto.generate.base.ApiResult;
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
				List<DataBase> dataBaseList = new ArrayList<DataBase>(); 
				DataBase dataBase = DataBase.getMaySql(newConfigName);
				dataBaseList.add(dataBase);
				boolean flag = this.createConfigXml(JSON.toJSONString(dataBaseList),newConfigFile.getPath() 
																			+ File.separator + newConfigName + "_map"+ ".xml");
				if(flag){
					if(!nameConfigFile.exists()){
						nameConfigFile.createNewFile();
						JSONArray nameConfigList = this.getDefaultConfigList(-1,"-----请选择-----",true);
						JSONObject nameConfig = this.getDefaultConfig(0,newConfigName,false);
						nameConfigList.add(nameConfig);
						flag = this.createConfigXml(nameConfigList.toJSONString(),nameConfigFile.getPath());
						if(flag){
							logger.info("创建配置文件xml成功");
						}else{
							logger.error("创建配置文件xml失败");
							return result.toJSONString(-1, "创建配置文件xml失败");
						}
					}else{
						logger.info("配置文件xml已存在,更新数据");
						
						XStream localXStream = new XStream();
						JSONArray nameConfigList = JSON.parseArray((String)localXStream.fromXML(nameConfigFile.getPath()));
						JSONObject jsonObject = JSON.parseObject(nameConfigList.getString(nameConfigList.size()-1));
						Integer id = jsonObject.getInteger("id");
						JSONObject newNameConfig = this.getDefaultConfig(++id,newConfigName,false);
						nameConfigList.add(newNameConfig);
						flag = this.createConfigXml(nameConfigList.toJSONString(),nameConfigFile.getPath());
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
	
	
	public JSONArray getNameConfigXml(String configPath) {
//		JSONObject json = new JSONObject();
//		json.put("id", -1);
//		json.put("text", "-----请选择-----");
//		json.put("selected", true);
//		
//		JSONArray list = new JSONArray();
//		list.add(json);
//		
//		File file = new File(configPath);
//		if(file.exists()){
//			XStream localXStream = new XStream();
//			localXStream.fromXML(file.);
//			jsonArray = JSONArray.fromObject(list);
//			logger.info("读取配置文件成功");
//		}else{
//			logger.info("配置文件未存在");
//		}
		
		return null;
	}
	
	/**
	 * 获取默认配置
	 * @Description: (方法职责详细描述,可空)  
	 * @Title: getDefaultConfig 
	 * @param id 			显示ID
	 * @param text 			显示文本
	 * @param selected 		是否默认选择
	 * @return
	 * @date 2016年3月8日 下午12:04:24  
	 * @author xiongbin
	 */
	private JSONObject getDefaultConfig(Integer id,String text,boolean selected){
		JSONObject json = new JSONObject();
		json.put("id", -1);
		json.put("text", text);
		json.put("selected", selected);
		
		return json;
	}
	
	/**
	 * 获取默认配置
	 * @Description: (方法职责详细描述,可空)  
	 * @Title: getDefaultConfigList 
	 * @param id 			显示ID
	 * @param text 			显示文本
	 * @param selected 		是否默认选择
	 * @return
	 * @date 2016年3月8日 下午12:04:24  
	 * @author xiongbin
	 */
	private JSONArray getDefaultConfigList(Integer id,String text,boolean selected){
		JSONObject json = new JSONObject();
		json.put("id", -1);
		json.put("text", text);
		json.put("selected", selected);
		
		JSONArray list = new JSONArray();
		list.add(json);
		
		return list;
	}
	
	/**
	 * 创建xml文件
	 * @Description: (方法职责详细描述,可空)  
	 * @Title: createConfigXml 
	 * @param model		集合列表
	 * @param path		创建路径
	 * @return
	 * @date 2016年3月8日 下午2:34:39  
	 * @author xiongbin
	 */
	private boolean createConfigXml(String model,String path){
	    try {
			XStream localXStream = new XStream();
			FileNIOCommon.writeStringToFile(path, localXStream.toXML(model), false);
			return true;
		} catch (IOException e) {
			logger.error("创建配置文件失败:" + e.getMessage(), e);
			return false;
		}
	}
}
