package com.auto.generate.code.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;


public class ConfigFiles implements Serializable{

	private static final long serialVersionUID = 1L;

	private Integer id;
	private String text;
	private boolean selected;

	public ConfigFiles(Integer id, String text, boolean selected) {
		this.id = id;
		this.text = text;
		this.selected = selected;
	}
	
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getText() {
		return text;
	}
	public void setText(String text) {
		this.text = text;
	}
	public boolean getSelected() {
		return selected;
	}
	public void setSelected(boolean selected) {
		this.selected = selected;
	}
	
	/**
	 * 获取默认配置
	 * @Description: (方法职责详细描述,可空)  
	 * @Title: getDefaultConfigList 
	 * @param id			id
	 * @param text			显示文本
	 * @param selected		是否选中
	 * @return
	 * @date 2016年6月27日 下午3:12:01  
	 * @author xiongbin
	 */
	public static List<ConfigFiles> getDefaultConfigList(Integer id,String text,boolean selected){
		ConfigFiles configFiles = new ConfigFiles(id,text,selected);
		
		List<ConfigFiles> list = new ArrayList<ConfigFiles>();
		list.add(configFiles);
		
		return list;
	}
	
	/**
	 * 获取默认配置
	 * @Description: (方法职责详细描述,可空)  
	 * @Title: getDefaultConfig 
	 * @param id			id
	 * @param text			显示文本
	 * @param selected		是否选中
	 * @return
	 * @date 2016年6月27日 下午3:14:30  
	 * @author xiongbin
	 */
	public static ConfigFiles getDefaultConfig(Integer id,String text,boolean selected){
		ConfigFiles configFiles = new ConfigFiles(id,text,selected);
		
		return configFiles;
	}
}
