/*
 * Copyright (c) 2015-2020 by caitu99
 * All rights reserved.
 */
package com.auto.generate.exception;

/** 
 * @Description: (类职责详细描述,可空) 
 * @ClassName: CodeException 
 * @author xiongbin
 * @date 2016年3月7日 下午5:37:01 
 * @Copyright (c) 2015-2020 by caitu99 
 */
public class CodeException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public CodeException() {
		super();
	}

	public CodeException(String message, Throwable cause) {
		super(message, cause);
	}

	public CodeException(String message) {
		super(message);
	}

	public CodeException(Throwable cause) {
		super(cause);
	}
}
