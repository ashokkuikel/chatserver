<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
  	<%@ page import="java.sql.*" %>
    <%@ page import="java.util.Date" %>
  	<%@  page import ="java.text.DateFormat" %>
    <%@ page import = "java.io.*,java.util.*, javax.servlet.*" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>New User Registration</title>
</head>
<body>
<%
Date currentDate = new Date();  
String dateToStr = DateFormat.getInstance().format(currentDate);  
out.println(dateToStr); 
%>
<%
            
             String name = request.getParameter("regname");
                         
             String email = request.getParameter("regemail");
                         
             String pass = request.getParameter("regpasswd");
             
     try
    {       
    	 String driverName = "com.mysql.jdbc.Driver";
    	 String url = "jdbc:mysql://localhost:3306/logindb";
    	 String user = "root";
    	 String dbpsw = "root";
    	 Class.forName(driverName);
 		Connection con = DriverManager.getConnection(url, user, dbpsw);
        Statement st =con.createStatement();
        
        st.executeUpdate("insert into new_registration(reg_name,reg_email,reg_passwd,datestamp)values('"+name +"', '"+email +"', '"+pass +"','"+dateToStr+"')");
        /* out.println("You are successfully Registered"); */  
    }
        catch(Exception e){
        out.println(e);
        }
     
     %>
	<jsp:forward page="home.jsp"/>
</body>
</html>