package com.radev.foundation.persistence;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.Query;

import com.radev.foundation.entity.Cliente;
import com.radev.foundation.persistence.manager.DAOManagerImpl;
import com.radev.foundation.persistence.manager.DBEntityManager;

public class ClienteDAO extends DAOManagerImpl<Object> {
	
	private Cliente cliente;
	private EntityManager em = DBEntityManager.getConnection();
	private List<Cliente> clientes = new ArrayList<Cliente>();
	
	@Override
	public void persist(Object entity) throws Exception, RuntimeException {
		
		super.persist(entity);

	}

	public Cliente findByLogin(String login) {
		
		Query q = em.createQuery("select u from Cliente u where u.login = :pLogin ");
		q.setParameter("pLogin", login); 
		
		try {
			return (Cliente)q.getSingleResult();
		} catch (Exception e) {
			return null;
		}
		
	}
	
	@SuppressWarnings("unchecked")
	public List<Cliente> listAll() {
		
		try {
			Query query = em.createQuery("select u from Cliente u");
			this.clientes = Collections.checkedList(query.getResultList(), Cliente.class);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return this.clientes;
		
	}
	
}
