/*
 * Copyright (c) 2015-2020 by caitu99
 * All rights reserved.
 */
package com.auto.generate.utils.log4j;

import java.io.File;

import org.apache.log4j.DailyRollingFileAppender;

/** 
 * @Description: (类职责详细描述,可空) 
 * @ClassName: MyDailyRollingFileAppender 
 * @author xiongbin
 * @date 2016年3月3日 下午3:01:12 
 * @Copyright (c) 2015-2020 by caitu99 
 */
public class MyDailyRollingFileAppender extends DailyRollingFileAppender {

	@Override
	public void setFile(String filePath) {
		File file = new File(filePath);
		if(!file.exists()){
			file.getParentFile().mkdirs();
		}
		super.setFile(filePath);
	}
}
