package com.makemytrip.makemytrip.repositories;

import com.makemytrip.makemytrip.models.Payment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PaymentRepository extends MongoRepository<Payment, String> {
    List<Payment> findByUserId(String userId);
    Payment findByTransactionId(String transactionId);
    List<Payment> findByUserIdOrderByTransactionDateDesc(String userId);
}