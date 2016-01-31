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
public class PedidoServiceDelete extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public PedidoServiceDelete() {
        super();
    }
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("json");
		String id = request.getParameter("id");
		
		DTOPedido pedido = new DTOPedido();
		
		PrintWriter out = response.getWriter();
		out.print(pedido.delete(Integer.parseInt(id)));
		out.close();
		
	}
	
}
