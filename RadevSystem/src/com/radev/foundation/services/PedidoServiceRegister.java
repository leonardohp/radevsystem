package com.radev.foundation.services;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Arrays;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class UserService
 */
public class PedidoServiceRegister extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public PedidoServiceRegister() {
		super();
	}

	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
	}

	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("json");

		String cabecalho[] = stringToList(request.getParameter("cabecalho"));
		String item[] = stringToList(request.getParameter("item"));
		String codigo[] = stringToList(request.getParameter("codigo"));
		String qtd[] = stringToList(request.getParameter("qtd"));	

		 DTOPedido pedido = new DTOPedido();
		  
		  PrintWriter out = response.getWriter(); 
		  try {			  
			out.print(pedido.registerpedido(cabecalho[1], cabecalho[0], cabecalho[5], cabecalho[4], cabecalho[2], cabecalho[3], cabecalho[6], item, codigo, qtd));
		  
		  } catch
		  (Exception e) { // TODO Auto-generated catch block
			  System.out.print(e);
			  e.printStackTrace(); 
		  } out.close();		 

	}
	
	
	private String[] stringToList(String str){
		String tsrList[] = str.replace("[\"", "").replace("\"]", "").split("\",\"");
	
		return tsrList;
	}
	

	
	

}
