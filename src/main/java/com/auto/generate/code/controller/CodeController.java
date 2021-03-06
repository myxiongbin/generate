package com.auto.generate.code.controller;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.auto.generate.base.ApiResult;
import com.auto.generate.base.BaseController;
import com.auto.generate.code.controller.component.CodeComponent;
import com.auto.generate.code.model.MySql;
import com.auto.generate.code.service.MySqlService;

@Controller
@RequestMapping("/auto/generate/code")
public class CodeController extends BaseController {
	
	private final static Logger logger = LoggerFactory.getLogger(CodeController.class);
	
	@Autowired
	private MySqlService mySqlService;
	
	@Autowired
	private CodeComponent codeComponent;
	
	/**
	 * 连接库表
	 * @Description: (方法职责详细描述,可空)  
	 * @Title: connect 
	 * @param driverClassName		数据库驱动
	 * @param url					数据库地址
	 * @param userName				数据库用户名
	 * @param password				数据库密码
	 * @return
	 * @date 2016年3月4日 下午11:01:26  
	 * @author xiongbin
	 */
	@RequestMapping(value="query/connect", produces="application/json;charset=utf-8")
	@ResponseBody
	public String connect(String driverClassName, String url, String userName,String password) {
		ApiResult<String> result = new ApiResult<String>();
		if(StringUtils.isBlank(driverClassName)){
			return result.toJSONString(-1, "参数driverClassName不能为空");
		}else if(StringUtils.isBlank(url)){
			return result.toJSONString(-1, "参数url不能为空");
		}else if(StringUtils.isBlank(userName)){
			return result.toJSONString(-1, "参数userName不能为空");
		}else if(StringUtils.isBlank(password)){
			return result.toJSONString(-1, "参数password不能为空");
		}
		
		mySqlService.connect(driverClassName, url, userName, password);
		
		return result.toJSONString(0, "success");
	}
	
	/**
	 * 查询库表
	 * @Description: (方法职责详细描述,可空)  
	 * @Title: queryTableName 
	 * @param tableSchema		库名
	 * @return
	 * @date 2016年3月4日 下午11:03:59  
	 * @author xiongbin
	 */
	@RequestMapping(value="query/tableName", produces="application/json;charset=utf-8")
	@ResponseBody
	public String queryTableName(String tableSchema) {
		ApiResult<List<MySql>> result = new ApiResult<List<MySql>>();
		if(StringUtils.isBlank(tableSchema)){
			return result.toJSONString(-1, "参数tableSchema不能为空");
		}
		
		List<MySql> list = mySqlService.queryTableName(tableSchema);
		
		return result.toJSONString(0, "success" , list);
	}
	
	/**
	 * 新增配置文件
	 * @Description: (方法职责详细描述,可空)  
	 * @Title: addConfig 
	 * @param configName	配置文件名称
	 * @return
	 * @date 2016年3月8日 下午6:16:00  
	 * @author xiongbin
	 */
	@RequestMapping(value="add/config", produces="application/json;charset=utf-8")
	@ResponseBody
	public String addConfig(String configName) {
		ApiResult<String> result = new ApiResult<String>();
		if(StringUtils.isBlank(configName)){
			return result.toJSONString(-1, "请输入配置名称");
		}
		
		return codeComponent.newConfigNameXml(configName);
	}
}
