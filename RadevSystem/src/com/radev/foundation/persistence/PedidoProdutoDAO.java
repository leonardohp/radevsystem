package com.radev.foundation.persistence;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.Query;

import com.radev.foundation.entity.PedidoProduto;
import com.radev.foundation.persistence.manager.DAOManagerImpl;
import com.radev.foundation.persistence.manager.DBEntityManager;

public class PedidoProdutoDAO extends DAOManagerImpl<Object> {
	
	private PedidoProduto pedidoProduto;
	private EntityManager em = DBEntityManager.getConnection();
	private List<PedidoProduto> pedidoProdutos = new ArrayList<PedidoProduto>();
	
	@Override
	public void persist(Object entity) throws Exception, RuntimeException {
		super.persist(entity);

	}

	public PedidoProduto findByLogin(String login) {
		
		Query q = em.createQuery("select u from PedidoProduto u where u.login = :pLogin ");
		q.setParameter("pLogin", login); 
		
		try {
			return (PedidoProduto)q.getSingleResult();
		} catch (Exception e) {
			return null;
		}
		
	}
	
	
	@SuppressWarnings("unchecked")
	public List<PedidoProduto> listAll() {
		
		try {
			Query query = em.createQuery("select u from PedidoProduto u where u.excluido != 1");
			this.pedidoProdutos = Collections.checkedList(query.getResultList(), PedidoProduto.class);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return this.pedidoProdutos;
		
	}
	
	public boolean excluir(int id) {
		try {
			em.getTransaction().begin();
			
			String query = "update PedidoProduto set excluido = 1 where pedido ="+ id;
			Query q = em.createNativeQuery(query);
			q.executeUpdate();
			
			em.getTransaction().commit();
			return true;
		} catch (Exception e) {
			em.getTransaction().rollback(); // desfaz transacao se ocorrer erro
											// ao persitir
		} finally {
			if (em.getTransaction().isActive()) {
				em.getTransaction().commit();
			}
		}

		return false;
		// q.setParameter("id", id);
		// q.executeUpdate();
	}


	
}
