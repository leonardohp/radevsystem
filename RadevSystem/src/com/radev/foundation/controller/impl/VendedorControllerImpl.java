package com.radev.foundation.controller.impl;

import java.util.List;

import org.primefaces.json.JSONObject;

import com.radev.foundation.controller.VendedorController;
import com.radev.foundation.entity.Vendedor;
import com.radev.foundation.persistence.VendedorDAO;

public class VendedorControllerImpl implements VendedorController {
	
	private VendedorDAO vendedorDAO = new VendedorDAO();
	
	public Vendedor findByLogin(String login) {
		return vendedorDAO.findByLogin(login);
	}
	
	public void persist(Vendedor vendedor) throws Exception {
		try {
			vendedorDAO.persist(vendedor);
		} catch (Exception e) {
			e.printStackTrace();
		}		
	}
	
	public List<Vendedor> listAll() {
		return vendedorDAO.listAll();		
	}

}
