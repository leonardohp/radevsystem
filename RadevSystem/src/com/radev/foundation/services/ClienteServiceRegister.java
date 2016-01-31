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
public class ClienteServiceRegister extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ClienteServiceRegister() {
        super();
    }
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("json");

		String nome = request.getParameter("nome");
		String email = request.getParameter("email");
		String cpf = request.getParameter("cpf");
		String rg = request.getParameter("rg");
		
		DTOCliente cliente = new DTOCliente();
		
		PrintWriter out = response.getWriter();
		try {
			out.print(cliente.registercliente(nome, email, cpf, rg));
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		out.close();
		
	}
	
}
