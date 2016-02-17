package com.radev.foundation.services;

import java.util.List;

import org.primefaces.json.JSONArray;
import org.primefaces.json.JSONException;
import org.primefaces.json.JSONObject;

import com.radev.foundation.controller.ClienteController;
import com.radev.foundation.controller.impl.ClienteControllerImpl;
import com.radev.foundation.entity.Cliente;


public class DTOCliente {
	
		public JSONObject getclientes() throws JSONException{
			ClienteController clienteController = new ClienteControllerImpl();
			List<Cliente> clienteList = clienteController.listAll();
			
			if(clienteList == null){
				return null;
			}
			
			JSONArray ja = new JSONArray();
			for(Cliente u : clienteList){
				JSONObject jo = new JSONObject();
				jo.put("id", u.getId());
				jo.put("nome", u.getNome());
				jo.put("email", u.getEmail());
				jo.put("cpf", u.getCpf());
				jo.put("rg", u.getRg());
				
				ja.put(jo);
			}
			
			JSONObject mainObj = new JSONObject();
			mainObj.put("clientelist", ja);
			return mainObj;
		}
		
		public boolean registercliente(String name, String email, String rg, String cpf) throws Exception{
			Cliente cliente = new Cliente();
			cliente.setNome(name);
			cliente.setEmail(email);
			cliente.setCpf(cpf);
			cliente.setRg(rg);
			if(cpf.length() > 14)
				cliente.setPessoa("J");
			else
				cliente.setPessoa("F");
			
			ClienteController clienteController = new ClienteControllerImpl();
			clienteController.persist(cliente);
			return true;
		}
	
}


