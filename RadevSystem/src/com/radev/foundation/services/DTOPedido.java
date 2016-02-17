package com.radev.foundation.services;

import java.util.ArrayList;
import java.util.List;

import org.primefaces.json.JSONArray;
import org.primefaces.json.JSONException;
import org.primefaces.json.JSONObject;

import com.radev.foundation.controller.PedidoController;
import com.radev.foundation.controller.PedidoProdutoController;
import com.radev.foundation.controller.impl.PedidoControllerImpl;
import com.radev.foundation.controller.impl.PedidoProdutoControllerImpl;
import com.radev.foundation.entity.Cliente;
import com.radev.foundation.entity.Pedido;
import com.radev.foundation.entity.PedidoProduto;


public class DTOPedido {
	
		public JSONObject getpedidos() throws JSONException{
			PedidoController pedidoController = new PedidoControllerImpl();
			List<Pedido> pedidoList = pedidoController.listAll();
			
			if(pedidoList == null){
				return null;
			}
			
			JSONArray ja = new JSONArray();
			for(Pedido u : pedidoList){
				JSONObject jo = new JSONObject();
				jo.put("id", u.getId());
				jo.put("cliente", u.getClientes().getId());
				jo.put("nomecliente", u.getClientes().getNome());
				jo.put("cpf", u.getClientes().getCpf());
				jo.put("data", u.getData());
				jo.put("valor", u.getValor());
				
				ja.put(jo);
			}
			
			JSONObject mainObj = new JSONObject();
			mainObj.put("pedidolist", ja);
			return mainObj;
		}
		
		public JSONObject getpedidosLiberar() throws JSONException{
			PedidoController pedidoController = new PedidoControllerImpl();
			List<Pedido> pedidoList = pedidoController.listAllLiberar();
			
			if(pedidoList == null){
				return null;
			}
			
			JSONArray ja = new JSONArray();
			for(Pedido u : pedidoList){
				JSONObject jo = new JSONObject();
				jo.put("id", u.getId());
				jo.put("cliente", u.getClientes().getId());
				jo.put("nomecliente", u.getClientes().getNome());
				jo.put("valor", u.getValor());
				
				ja.put(jo);
			}
			
			JSONObject mainObj = new JSONObject();
			mainObj.put("pedidolist", ja);
			return mainObj;
		}
		
		public JSONObject getpedido(int id) throws JSONException{
			PedidoController pedidoController = new PedidoControllerImpl();
			Pedido u = pedidoController.findById(id);
			
			if(u == null){
				return null;
			}
			
			JSONArray ja = new JSONArray();

			JSONObject jo = new JSONObject();
			jo.put("id", u.getId());
			jo.put("cliente", u.getClientes().getId());
			jo.put("vendedor", u.getVendedor());
			jo.put("cpf", u.getClientes().getCpf());
			jo.put("data", u.getData());
			jo.put("endc", u.getEndC());
			jo.put("ende", u.getEndE());
			jo.put("pgto", u.getCondPgto());
			
			ja.put(jo);
			
			JSONObject mainObj = new JSONObject();
			mainObj.put("pedido", ja);
			return mainObj;
		}
		
		public JSONObject getitens(int id) throws JSONException{
			PedidoProdutoController pedidoProdutoController = new PedidoProdutoControllerImpl();
			List<PedidoProduto> pedidoProdutoList = pedidoProdutoController.listAll();
			
			if(pedidoProdutoList == null){
				return null;
			}
			
			JSONArray ja = new JSONArray();
			for(PedidoProduto u : pedidoProdutoList){
				if(u.getPedido() == id){
					JSONObject jo = new JSONObject();
					jo.put("id", u.getId());
					jo.put("item", u.getItem());
					jo.put("quantidade", u.getQtd());
					jo.put("produto", u.getProduto());
					
					ja.put(jo);
				}
			}
			
			JSONObject mainObj = new JSONObject();
			mainObj.put("itenlist", ja);
			return mainObj;
		}
		
		public boolean registerpedido(String data, String cliente, String vendedor, String valor, String endC, String endE, String condPgto,
										String item[], String produto[], String qtd[]) throws Exception{
			Pedido pedido = new Pedido();
			Cliente c = new Cliente();
			//pedido.setId(Integer.parseInt(id));
			pedido.setData(data);
			c.setId(Integer.parseInt(cliente));
			pedido.setClientes(c);
			pedido.setVendedor(Integer.parseInt(vendedor));
			pedido.setValor(Float.parseFloat(valor));
			pedido.setEndC(endC);
			pedido.setEndE(endE);
			pedido.setCondPgto(condPgto);
			
			PedidoController pedidoController = new PedidoControllerImpl();
			pedidoController.persist(pedido);
			int lastID = pedidoController.getLastPedido();
			
			
			for(int i = 0; i < item.length; i++){
			
				PedidoProduto pedidoproduto = new PedidoProduto();
				pedidoproduto.setItem(Integer.parseInt(item[i]));
				pedidoproduto.setPedido(lastID);
				pedidoproduto.setProduto(Integer.parseInt(produto[i]));
				pedidoproduto.setQtd(Integer.parseInt(qtd[i]));
				
				PedidoProdutoController pedidoProdutoController = new PedidoProdutoControllerImpl();
				pedidoProdutoController.persist(pedidoproduto);			
			}
			
			return true;
		}
		
		
		
		public boolean editItensPedido(int id, float val, String item[], String produto[], String qtd[]) throws Exception{
				PedidoProdutoController pedidoProdutoController = new PedidoProdutoControllerImpl();
				pedidoProdutoController.excluir(id);
				updateValor(id, val);
				
				for(int i = 0; i < item.length; i++){				
					PedidoProduto pedidoproduto = new PedidoProduto();
					pedidoproduto.setItem(Integer.parseInt(item[i]));
					pedidoproduto.setPedido(id);
					pedidoproduto.setProduto(Integer.parseInt(produto[i]));
					pedidoproduto.setQtd(Integer.parseInt(qtd[i]));
					
					pedidoProdutoController.persist(pedidoproduto);			
				}
				
				return true;
		}
		
		public int getLastPedido(){
			PedidoController pedidoController = new PedidoControllerImpl();
			return pedidoController.getLastPedido();
			
		}
		
		public void updateValor(int id, float valor){
			PedidoController pedidoController = new PedidoControllerImpl();
			pedidoController.updateValor(id, valor);
			
		}
		
		public boolean delete(int id){
			PedidoController pedidoController = new PedidoControllerImpl();
			return pedidoController.excluir(id);
			
		}
		
		public boolean liberar(String liberar[]){
			PedidoController pedidoController = new PedidoControllerImpl();
			for(String l : liberar){
				if(!pedidoController.liberar(Integer.parseInt(l)))
					return false;
			}
			return true;
			
		}

	
}


