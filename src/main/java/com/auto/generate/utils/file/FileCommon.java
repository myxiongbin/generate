package com.auto.generate.utils.file;
import java.io.BufferedWriter;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStreamWriter;
import java.util.ArrayList;
import java.util.List;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.log4j.Category;

public class FileCommon{
	
	static Category logger = Category.getInstance(FileCommon.class.getName());
	/**
	 * 输出json文件
	 * @param fileContent	文件内容
	 * @param fileType		文件类型
	 * @param filePath		文件路径
	 */
	public static void exportOfLocalDiskFile(String fileContent,String filePath){
		File dirFile = new File(filePath);
		if (!dirFile.exists()) {
			//dirFile.mkdirs();
		}
		BufferedWriter out = null;
		File file = new File(filePath);
		
	 	try{
	 		out = new BufferedWriter(new FileWriter(file, true));
	 		out.write(fileContent);
	 	}catch (IOException e) {
	 		e.printStackTrace();
	 	}finally{
	 		if (out != null) {
	 			try {
	 				out.close();
	 			} catch (IOException e) {
	 				e.printStackTrace();
	 			}
	 		}
	 	}
	}
	
	public static void main(String[] args) throws IOException, Exception{
    	//File sysFile = new File("C:\\Users\\xb\\Documents\\RapGerTool");
    	//FileCommon.exportOfLocalDiskFile("[{\"id\":0,\"text\":\"双视窗\"},{\"id\":1,\"text\":\"四视窗\",\"selected\":true}]","json",sysFile.getPath());
		String json = FileCommon.readFileToString("C:\\Users\\xb\\Documents\\RapGerTool.json", "utf-8");
		//System.out.println(json.replace("[", "").replace("]", ""));
		//String jj = "[{'id':0,'text':'双视窗'},{'id':1,'text':'四视窗','selected':true}]";
		JSONArray jsonArray = JSONArray.fromObject(json);
		for(int i=0;i<jsonArray.size();i++){
			JSONObject jsonObject = jsonArray.getJSONObject(i);
			System.out.println(jsonObject.toString());
		}
		JSONObject jsonObject = jsonArray.getJSONObject(jsonArray.size()-1);
		System.out.println(jsonObject.get("id"));
    } 
	
	public static int getJsonId(String json,String id){
		JSONArray jsonArray = JSONArray.fromObject(json);
		JSONObject jsonObject = jsonArray.getJSONObject(jsonArray.size()-1);
		return jsonObject.getInt(id);
	}
	
	public static String updateJson(String oldJson,String newJson){
		JSONArray jsonArray = JSONArray.fromObject(oldJson);
		JSONObject jsonObject = JSONObject.fromObject(newJson);
		jsonArray.add(jsonObject);
		return jsonArray.toString();
	}
	
	/**
	 * 将byte数组转换为表示16进制值的字符串， 如：byte[]{8,18}转换为：0813， 和public static byte[] hexStr2ByteArr(String strIn) 互为可逆的转换过程
	 * 
	 * @param arrB
	 *            需要转换的byte数组
	 * @return 转换后的字符串
	 * @throws Exception
	 *             本方法不处理任何异常，所有异常全部抛出
	 */
	public static String byteArr2HexStr(byte[] arrB) throws Exception {
		int iLen = arrB.length;
		// 每个byte用两个字符才能表示，所以字符串的长度是数组长度的两倍
		StringBuffer sb = new StringBuffer(iLen * 2);
		for (int i = 0; i < iLen; i++) {
			int intTmp = arrB[i];
			// 把负数转换为正数
			while (intTmp < 0) {
				intTmp = intTmp + 256;
			}
			// 小于0F的数需要在前面补0
			if (intTmp < 16) {
				sb.append("0");
			}
			sb.append(Integer.toString(intTmp, 16));
		}
		return sb.toString();
	}

	/**
	 * 将表示16进制值的字符串转换为byte数组， 和public static String byteArr2HexStr(byte[] arrB) 互为可逆的转换过程
	 * 
	 * @param strIn
	 *            需要转换的字符串
	 * @return 转换后的byte数组
	 * @throws Exception
	 *             本方法不处理任何异常，所有异常全部抛出 @ <a href="mailto:leo841001@163.com">LiGuoQing</a>
	 */
	public static byte[] hexStr2ByteArr(String strIn) throws Exception {
		byte[] arrB = strIn.getBytes();
		int iLen = arrB.length;

		// 两个字符表示一个字节，所以字节数组长度是字符串长度除以2
		byte[] arrOut = new byte[iLen / 2];
		for (int i = 0; i < iLen; i = i + 2) {
			String strTmp = new String(arrB, i, 2);
			arrOut[i / 2] = (byte) Integer.parseInt(strTmp, 16);
		}
		return arrOut;
	}
	
	final static int bufferSize = 1024*20;
	/////////////////////////////////////////////////////////
	
	public static void mkdirWithFullName(String fullPath){
		fullPath = fullPath.replaceAll("\\\\", "\\/");
		int tag = fullPath.lastIndexOf("/");
		if(tag!=-1&&tag!=0){
			String path = fullPath.substring(0, fullPath.lastIndexOf("/"));
			File file = new File(path);
			if(!file.exists()){
				file.mkdirs();
			}
		}
	}
	/////////////////////////////////////////////////////////
	public static void writeFileByByte(String fullPath, byte[] b) { 
		FileOutputStream fos=null;   
        try{   
        	mkdirWithFullName(fullPath);
            fos=new FileOutputStream(fullPath);   
            fos.write(b);  
            fos.flush();
            logger.info("复制文件到" + fullPath + "成功");
        }     
        catch(Exception e){   
        	logger.error("复制文件到" + fullPath + "失败");
            e.printStackTrace();
        }   
        finally{   
            try{   
                fos.close();   
            }   
            catch(IOException iex){}   
        }  
	}
	public static void writeFileByInputStream(String fullPath, InputStream in) { 
		FileOutputStream fos=null;   
        try{   
        	byte[] b = readInputStreamToByte(in);
        	mkdirWithFullName(fullPath);
            fos=new FileOutputStream(fullPath);   
            fos.write(b);  
            fos.flush();     
        }     
        catch(Exception e){   
            e.printStackTrace();   
        }   
        finally{   
            try{   
                fos.close();   
            }   
            catch(IOException iex){}   
        }  
	}
	public static void writeFileByAppend(String fullPath, String c) { 
		FileOutputStream fos=null;   
        try{   
        	mkdirWithFullName(fullPath);
            fos=new FileOutputStream(fullPath,true);   
            fos.write(c.getBytes());  
            fos.flush();     
        }     
        catch(Exception e){   
            e.printStackTrace();   
        }   
        finally{   
            try{   
                fos.close();   
            }   
            catch(IOException iex){}   
        }  
	}
	public static void writeFile(String fullPath, String c) { 
		FileOutputStream fos=null;  
		OutputStreamWriter out =null;
        try{   
        	mkdirWithFullName(fullPath);
            fos=new FileOutputStream(fullPath);   
            out = new OutputStreamWriter(fos,"UTF-8");
            out.append(c);  
            out.flush();     
        }     
        catch(Exception e){   
            e.printStackTrace();   
        }   
        finally{   
            try{   
                fos.close();
                out.close();
            }   
            catch(IOException iex){}   
        }  
	}

	/////////////////////////////////////////////////////////
	public static void printHexString( byte[] b) { 
		for (int i = 0; i < b.length; i++) { 
			String hex = Integer.toHexString(b[i] & 0xFF); 
			if (hex.length() == 1) { 
				hex = '0' + hex; 
			} 
			System.out.print(hex.toUpperCase() ); 
		} 

	}
	/////////////////////////////////////////////////////////
	/**
	 * 读取文件
	 * @param filePath
	 * @return
	 * @throws IOException
	 */
	public static byte[] readFileToByte(String filePath) throws IOException{
		java.io.FileInputStream inputStream = new java.io.FileInputStream(new File(filePath));
		ByteArrayOutputStream byteOut = new ByteArrayOutputStream();
		//FileCommon.readIn(inputStream, byteOut);
		 byte[] byteArray = new byte[bufferSize];
		 int n = 0;
		 while (-1 != (n = inputStream.read(byteArray))) {
			 byteOut.write(byteArray, 0, n);
		 }
		inputStream.close();
		
		logger.info("将文件" + filePath);
		
		return byteOut.toByteArray();
	}
	public static byte[] readInputStreamToByte(InputStream in) throws IOException{
		ByteArrayOutputStream byteOut = new ByteArrayOutputStream();
		//FileCommon.readIn(inputStream, byteOut);
		 byte[] byteArray = new byte[bufferSize];
		 int n = 0;
		 while (-1 != (n = in.read(byteArray))) {
			 byteOut.write(byteArray, 0, n);
		 }
		 byteOut.close();
		return byteOut.toByteArray();
	}
	/**
	 * 读取文件
	 * @param filePath
	 * @return
	 * @throws IOException
	 */
	public static String readFileToString(String filePath,String encoding) throws IOException{
		java.io.FileInputStream inputStream = new java.io.FileInputStream(new File(filePath));
		ByteArrayOutputStream byteOut = new ByteArrayOutputStream();

		 byte[] byteArray = new byte[bufferSize];
		 int n = 0;
		 while (-1 != (n = inputStream.read(byteArray))) {
			 byteOut.write(byteArray, 0, n);
		 }
		 
		inputStream.close();
		byteOut.close();
		return new String(byteOut.toByteArray(),encoding==null?"utf-8":encoding);
	}
	
	public static String readFileToString(String filePath) throws IOException{
		java.io.FileInputStream inputStream = new java.io.FileInputStream(new File(filePath));
		ByteArrayOutputStream byteOut = new ByteArrayOutputStream();

		 byte[] byteArray = new byte[bufferSize];
		 int n = 0;
		 while (-1 != (n = inputStream.read(byteArray))) {
			 byteOut.write(byteArray, 0, n);
		 }
		 
		inputStream.close();
		byteOut.close();
		return new String(byteOut.toByteArray());
	}
	
	////////////////////////////////////////////////////////begin
	public static void readIn(InputStream ins, ByteArrayOutputStream byteOut) throws IOException {

		byte[] line = readRawLine(ins);
		if (line == null) {
			return;
		}
		int nextSize = getNextSize(line);
		if (nextSize >= 0) {
			line = readRawLine(ins);
			if (line != null) {
				int length = line.length;
				if (line[length - 2] == '\r') {
					byteOut.write(line, 0, length - 2);
				} else {
					byteOut.write(line);
				}
			}
		} else {
			byteOut.write(line);
		}
		// 继续往下读
		readIn(ins, byteOut);
	}
	/**
	 * 读取整行数据
	 * 
	 * @param inputStream
	 * @return
	 * @throws IOException
	 */
	private static byte[] readRawLine(InputStream inputStream) throws IOException {

		ByteArrayOutputStream buf = new ByteArrayOutputStream();
		int ch;
		while ((ch = inputStream.read()) >= 0) {
			buf.write(ch);
			if (ch == '\n') { // be tolerant (RFC-2616 Section 19.3)
				break;
			}
		}
		if (buf.size() == 0) {
			return null;
		}
		return buf.toByteArray();
	}
	/**
	 * 读取下面的数据
	 * 
	 * @param line
	 * @return
	 */
	private static int getNextSize(byte[] line) {
		if (line == null)
			return -1;
		int length = line.length;
		int nextSize = -1;
		if (length <= 6 && line[length - 2] == '\r' && line[length - 1] == '\n') {
			String a = new String(line, 0, length - 2);
			try {
				nextSize = Integer.parseInt(a, 16);
			} catch (NumberFormatException e) {
				nextSize = -1;
			}
		}
		return nextSize;
	}
	////////////////////////////////////////////////////////end
	
    public static void delFolderAndFiles(String path) {   
        File myFile = new File(path); 
        delFolderAndFiles(myFile) ;
    } 
    public static void delFolderAndFiles(File myFile){
    	if(myFile==null) return ;
    	if(myFile.isDirectory()){
        	File[] f = myFile.listFiles();
        	for (int i = 0; f!=null && i < f.length; i++) {
        		delFolderAndFiles(f[i]);
        		f[i].delete();
			}
        	myFile.delete();
        }else if (myFile.exists()) {   
            myFile.delete();   
        }
    }
    
    /**
     * 递归获取文件夹下的全部文件列表
     * @param file
     * @param list
     */
    public static void queryAllFiles(File file, List<File> list){
    	if(file==null) return ;
    	if(file.isDirectory()){
    		list.add(file);
        	File[] f = file.listFiles();
        	for (int i = 0; f!=null && i < f.length; i++) {
        		queryAllFiles(f[i],list);
			}
        }else if (file.exists()) {   
        	list.add(file);
        }
    }
    //list
    public static List<byte[]> readFileToByteList(List<String> filePathList) throws IOException{
    	List<byte[]> byteList = new ArrayList<byte[]>();
    	java.io.FileInputStream inputStream = null;
    	ByteArrayOutputStream byteOut = null;
    	for(int i=0;i<filePathList.size();i++){
    		String filePath = filePathList.get(i);
    		inputStream = new java.io.FileInputStream(new File(filePath));
			byteOut = new ByteArrayOutputStream();
			//FileCommon.readIn(inputStream, byteOut);
			 byte[] byteArray = new byte[bufferSize];
			 int n = 0;
			 while (-1 != (n = inputStream.read(byteArray))) {
				 byteOut.write(byteArray, 0, n);
			 }
			 byteList.add(byteOut.toByteArray());
			 
			 if(i == filePathList.size()-1){
				 inputStream.close();
			 }
    	}
    	
    	return byteList;
	}
    
    public static void writeFileByByteList(List<String> fullPathList, List<byte[]> bList) throws IOException { 
		FileOutputStream fos=null;
		for(int i=0;i<fullPathList.size();i++){
			String fullPath = fullPathList.get(i);
	          
        	mkdirWithFullName(fullPath);
            fos=new FileOutputStream(fullPath);   
            fos.write(bList.get(i));  
            fos.flush();
            
            if(i == fullPathList.size() - 1){
            	fos.close(); 
            }
         }
	}
} 