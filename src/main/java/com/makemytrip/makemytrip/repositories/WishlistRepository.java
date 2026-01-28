package com.makemytrip.makemytrip.repositories;

import com.makemytrip.makemytrip.models.Wishlist;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface WishlistRepository extends MongoRepository<Wishlist, String> {
    List<Wishlist> findByUserId(String userId);
    List<Wishlist> findByUserIdAndFolderName(String userId, String folderName);
}