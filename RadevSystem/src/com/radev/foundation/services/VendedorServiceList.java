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
public class VendedorServiceList extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public VendedorServiceList() {
        super();
    }
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		request.setCharacterEncoding("utf-8");
		response.setCharacterEncoding("utf-8");
		
		DTOVendedor vendedor = new DTOVendedor();
		
		PrintWriter out = response.getWriter();
		try {
			out.print(vendedor.getvendedores());
		} catch (JSONException e) {
			e.printStackTrace();
		}
		out.close();
		
	}
	
}
