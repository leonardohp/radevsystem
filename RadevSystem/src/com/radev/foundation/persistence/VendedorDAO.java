package com.radev.foundation.persistence;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.Query;

import com.radev.foundation.entity.Vendedor;
import com.radev.foundation.persistence.manager.DAOManagerImpl;
import com.radev.foundation.persistence.manager.DBEntityManager;

public class VendedorDAO extends DAOManagerImpl<Object> {
	
	private Vendedor vendedor;
	private EntityManager em = DBEntityManager.getConnection();
	private List<Vendedor> vendedors = new ArrayList<Vendedor>();
	
	@Override
	public void persist(Object entity) throws Exception, RuntimeException {
		
		super.persist(entity);

	}

	public Vendedor findByLogin(String login) {
		
		Query q = em.createQuery("select u from Vendedor u where u.login = :pLogin ");
		q.setParameter("pLogin", login); 
		
		try {
			return (Vendedor)q.getSingleResult();
		} catch (Exception e) {
			return null;
		}
		
	}
	
	@SuppressWarnings("unchecked")
	public List<Vendedor> listAll() {
		
		try {
			Query query = em.createQuery("select u from Vendedor u");
			this.vendedors = Collections.checkedList(query.getResultList(), Vendedor.class);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return this.vendedors;
		
	}
	
}
