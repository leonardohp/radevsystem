package com.radev.foundation.persistence;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.Query;

import com.radev.foundation.entity.Produto;
import com.radev.foundation.persistence.manager.DAOManagerImpl;
import com.radev.foundation.persistence.manager.DBEntityManager;

public class ProdutoDAO extends DAOManagerImpl<Object> {
	
	private Produto produto;
	private EntityManager em = DBEntityManager.getConnection();
	private List<Produto> produtos = new ArrayList<Produto>();
	
	@Override
	public void persist(Object entity) throws Exception, RuntimeException {
		
		super.persist(entity);

	}

	public Produto findByLogin(String login) {
		
		Query q = em.createQuery("select u from Produto u where u.login = :pLogin ");
		q.setParameter("pLogin", login); 
		
		try {
			return (Produto)q.getSingleResult();
		} catch (Exception e) {
			return null;
		}
		
	}
	
	@SuppressWarnings("unchecked")
	public List<Produto> listAll() {
		
		try {
			Query query = em.createQuery("select u from Produto u");
			this.produtos = Collections.checkedList(query.getResultList(), Produto.class);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return this.produtos;
		
	}
	
}
