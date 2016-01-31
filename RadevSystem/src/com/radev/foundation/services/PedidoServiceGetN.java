package com.radev.foundation.services;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.primefaces.json.JSONException;

/**
 * Servlet implementation class UserService
 */
public class PedidoServiceGetN extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public PedidoServiceGetN() {
        super();
    }
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		DTOPedido pedido = new DTOPedido();
		
		PrintWriter out = response.getWriter();
		out.print(pedido.getLastPedido()+1);
		out.close();
		
	}
	
}
