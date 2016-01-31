package com.radev.foundation.services;

import java.util.List;

import org.primefaces.json.JSONArray;
import org.primefaces.json.JSONException;
import org.primefaces.json.JSONObject;

import com.radev.foundation.controller.ProdutoController;
import com.radev.foundation.controller.impl.ProdutoControllerImpl;
import com.radev.foundation.entity.Produto;


public class DTOProduto {
	
		public JSONObject getprodutos() throws JSONException{
			ProdutoController produtoController = new ProdutoControllerImpl();
			List<Produto> produtoList = produtoController.listAll();
			
			if(produtoList == null){
				return null;
			}
			
			JSONArray ja = new JSONArray();
			for(Produto u : produtoList){
				JSONObject jo = new JSONObject();
				jo.put("id", u.getId());
				jo.put("descricao", u.getDescricao());
				jo.put("valor", u.getValor());
				
				ja.put(jo);
			}
			
			JSONObject mainObj = new JSONObject();
			mainObj.put("produtolist", ja);
			return mainObj;
		}
			
}


