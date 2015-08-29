package com.radev.foundation.persistence;

import javax.persistence.EntityManager;
import javax.persistence.Query;

import com.radev.foundation.entity.Filial;
import com.radev.foundation.persistence.manager.DAOManagerImpl;
import com.radev.foundation.persistence.manager.DBEntityManager;

public class FilialDAO extends DAOManagerImpl<Object> {
	
	private Filial filial;
	private EntityManager em = DBEntityManager.getConnection();
	
	@Override
	public void persist(Object entity) throws Exception, RuntimeException {
		
		filial = findByCodigo(((Filial)entity).getCodigo());
		
		if (filial == null)
			super.persist(entity);
		else {
			int id = filial.getId();
			
			filial = (Filial)entity;
			filial.setId(id);
			
			super.merge(filial);
		}
	}

	public Filial findByCodigo(int codigo) {
		
		Query q = em.createQuery("select f from Filial f where f.codigo = :pCodigo ");
		q.setParameter("pCodigo", codigo); 
		
		try {
			return (Filial)q.getSingleResult();
		} catch (Exception e) {
			return null;
		}
		
	}

}
