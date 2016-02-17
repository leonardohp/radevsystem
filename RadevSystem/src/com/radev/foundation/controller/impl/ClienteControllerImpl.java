package com.radev.foundation.controller.impl;

import java.util.List;

import org.primefaces.json.JSONObject;

import com.radev.foundation.controller.ClienteController;
import com.radev.foundation.entity.Cliente;
import com.radev.foundation.persistence.ClienteDAO;

public class ClienteControllerImpl implements ClienteController {
	
	private ClienteDAO clienteDAO = new ClienteDAO();
	
	public Cliente findByLogin(String login) {
		return clienteDAO.findByLogin(login);
	}
	
	public void persist(Cliente cliente) throws Exception {
		try {
			clienteDAO.persist(cliente);
		} catch (Exception e) {
			e.printStackTrace();
		}		
	}
	
	public List<Cliente> listAll() {
		return clienteDAO.listAll();		
	}
	

}
