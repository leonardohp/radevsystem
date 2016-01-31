package com.radev.foundation.services;

import java.util.List;

import org.primefaces.json.JSONArray;
import org.primefaces.json.JSONException;
import org.primefaces.json.JSONObject;

import com.radev.foundation.controller.VendedorController;
import com.radev.foundation.controller.impl.VendedorControllerImpl;
import com.radev.foundation.entity.Vendedor;


public class DTOVendedor {
	
		public JSONObject getvendedores() throws JSONException{
			VendedorController vendedorController = new VendedorControllerImpl();
			List<Vendedor> vendedorList = vendedorController.listAll();
			
			if(vendedorList == null){
				return null;
			}
			
			JSONArray ja = new JSONArray();
			for(Vendedor u : vendedorList){
				JSONObject jo = new JSONObject();
				jo.put("id", u.getId());
				jo.put("nome", u.getNome());
				jo.put("email", u.getEmail());
				jo.put("cpf", u.getCpf());
				jo.put("rg", u.getRg());
				
				ja.put(jo);
			}
			
			JSONObject mainObj = new JSONObject();
			mainObj.put("vendedorlist", ja);
			return mainObj;
		}
		
		public boolean registervendedor(String name, String email, String rg, String cpf) throws Exception{
			Vendedor vendedor = new Vendedor();
			vendedor.setNome(name);
			vendedor.setEmail(email);
			vendedor.setCpf(cpf);
			vendedor.setRg(rg);
			
			VendedorController vendedorController = new VendedorControllerImpl();
			vendedorController.persist(vendedor);
			return true;
		}
	
}


