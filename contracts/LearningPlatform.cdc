// LearningPlatform Smart Contract on Flow Blockchain
// This contract manages user profiles, achievements, and certifications

pub contract LearningPlatform {
    
    // Events
    pub event UserProfileCreated(userAddress: Address, name: String)
    pub event AchievementUnlocked(userAddress: Address, achievementId: UInt64, title: String)
    pub event CertificateIssued(userAddress: Address, certificateId: UInt64, courseName: String)
    
    // User Profile Structure
    pub struct UserProfile {
        pub let userAddress: Address
        pub var name: String
        pub var bio: String
        pub var avatarUrl: String
        pub var totalPoints: UInt64
        pub var level: UInt64
        pub var achievements: [UInt64]
        pub var certificates: [UInt64]
        pub let createdAt: UFix64
        pub var updatedAt: UFix64
        
        init(userAddress: Address, name: String, bio: String, avatarUrl: String) {
            self.userAddress = userAddress
            self.name = name
            self.bio = bio
            self.avatarUrl = avatarUrl
            self.totalPoints = 0
            self.level = 1
            self.achievements = []
            self.certificates = []
            self.createdAt = getCurrentBlock().timestamp
            self.updatedAt = getCurrentBlock().timestamp
        }
        
        pub fun updateProfile(name: String, bio: String, avatarUrl: String) {
            self.name = name
            self.bio = bio
            self.avatarUrl = avatarUrl
            self.updatedAt = getCurrentBlock().timestamp
        }
        
        pub fun addPoints(points: UInt64) {
            self.totalPoints = self.totalPoints + points
            self.level = self.totalPoints / 1000 + 1 // Level up every 1000 points
            self.updatedAt = getCurrentBlock().timestamp
        }
        
        pub fun addAchievement(achievementId: UInt64) {
            if !self.achievements.contains(achievementId) {
                self.achievements.append(achievementId)
                self.updatedAt = getCurrentBlock().timestamp
            }
        }
        
        pub fun addCertificate(certificateId: UInt64) {
            if !self.certificates.contains(certificateId) {
                self.certificates.append(certificateId)
                self.updatedAt = getCurrentBlock().timestamp
            }
        }
    }
    
    // Achievement Structure
    pub struct Achievement {
        pub let id: UInt64
        pub let title: String
        pub let description: String
        pub let iconUrl: String
        pub let points: UInt64
        pub let rarity: String // Common, Rare, Epic, Legendary
        
        init(id: UInt64, title: String, description: String, iconUrl: String, points: UInt64, rarity: String) {
            self.id = id
            self.title = title
            self.description = description
            self.iconUrl = iconUrl
            self.points = points
            self.rarity = rarity
        }
    }
    
    // Certificate Structure
    pub struct Certificate {
        pub let id: UInt64
        pub let courseName: String
        pub let description: String
        pub let issuerName: String
        pub let issueDate: UFix64
        pub let validUntil: UFix64?
        pub let certificateHash: String
        
        init(id: UInt64, courseName: String, description: String, issuerName: String, validUntil: UFix64?, certificateHash: String) {
            self.id = id
            self.courseName = courseName
            self.description = description
            self.issuerName = issuerName
            self.issueDate = getCurrentBlock().timestamp
            self.validUntil = validUntil
            self.certificateHash = certificateHash
        }
    }
    
    // Storage paths
    pub let UserProfileStoragePath: StoragePath
    pub let UserProfilePublicPath: PublicPath
    
    // Contract state
    access(self) var userProfiles: {Address: UserProfile}
    access(self) var achievements: {UInt64: Achievement}
    access(self) var certificates: {UInt64: Certificate}
    access(self) var nextAchievementId: UInt64
    access(self) var nextCertificateId: UInt64
    
    // Admin capability
    access(self) let adminAddress: Address
    
    init() {
        self.UserProfileStoragePath = /storage/LearningPlatformUserProfile
        self.UserProfilePublicPath = /public/LearningPlatformUserProfile
        
        self.userProfiles = {}
        self.achievements = {}
        self.certificates = {}
        self.nextAchievementId = 1
        self.nextCertificateId = 1
        self.adminAddress = self.account.address
        
        // Create default achievements
        self.createDefaultAchievements()
    }
    
    // Public functions
    pub fun createUserProfile(name: String, bio: String, avatarUrl: String): Bool {
        let userAddress = self.account.address
        
        if self.userProfiles[userAddress] != nil {
            return false // Profile already exists
        }
        
        let profile = UserProfile(
            userAddress: userAddress,
            name: name,
            bio: bio,
            avatarUrl: avatarUrl
        )
        
        self.userProfiles[userAddress] = profile
        
        emit UserProfileCreated(userAddress: userAddress, name: name)
        return true
    }
    
    pub fun updateUserProfile(name: String, bio: String, avatarUrl: String): Bool {
        let userAddress = self.account.address
        
        if let profile = &self.userProfiles[userAddress] as &UserProfile? {
            profile.updateProfile(name: name, bio: bio, avatarUrl: avatarUrl)
            return true
        }
        
        return false
    }
    
    pub fun getUserProfile(userAddress: Address): UserProfile? {
        return self.userProfiles[userAddress]
    }
    
    pub fun getAchievement(achievementId: UInt64): Achievement? {
        return self.achievements[achievementId]
    }
    
    pub fun getCertificate(certificateId: UInt64): Certificate? {
        return self.certificates[certificateId]
    }
    
    pub fun getAllAchievements(): {UInt64: Achievement} {
        return self.achievements
    }
    
    pub fun unlockAchievement(userAddress: Address, achievementId: UInt64): Bool {
        if let profile = &self.userProfiles[userAddress] as &UserProfile? {
            if let achievement = self.achievements[achievementId] {
                profile.addAchievement(achievementId: achievementId)
                profile.addPoints(points: achievement.points)
                
                emit AchievementUnlocked(
                    userAddress: userAddress,
                    achievementId: achievementId,
                    title: achievement.title
                )
                return true
            }
        }
        return false
    }
    
    // Admin functions
    pub fun createAchievement(title: String, description: String, iconUrl: String, points: UInt64, rarity: String): UInt64 {
        pre {
            self.account.address == self.adminAddress: "Only admin can create achievements"
        }
        
        let achievementId = self.nextAchievementId
        let achievement = Achievement(
            id: achievementId,
            title: title,
            description: description,
            iconUrl: iconUrl,
            points: points,
            rarity: rarity
        )
        
        self.achievements[achievementId] = achievement
        self.nextAchievementId = self.nextAchievementId + 1
        
        return achievementId
    }
    
    pub fun issueCertificate(
        userAddress: Address,
        courseName: String,
        description: String,
        issuerName: String,
        validUntil: UFix64?,
        certificateHash: String
    ): UInt64? {
        pre {
            self.account.address == self.adminAddress: "Only admin can issue certificates"
        }
        
        if let profile = &self.userProfiles[userAddress] as &UserProfile? {
            let certificateId = self.nextCertificateId
            let certificate = Certificate(
                id: certificateId,
                courseName: courseName,
                description: description,
                issuerName: issuerName,
                validUntil: validUntil,
                certificateHash: certificateHash
            )
            
            self.certificates[certificateId] = certificate
            profile.addCertificate(certificateId: certificateId)
            self.nextCertificateId = self.nextCertificateId + 1
            
            emit CertificateIssued(
                userAddress: userAddress,
                certificateId: certificateId,
                courseName: courseName
            )
            
            return certificateId
        }
        
        return nil
    }
    
    // Internal functions
    access(self) fun createDefaultAchievements() {
        // First Login Achievement
        let firstLoginId = self.nextAchievementId
        self.achievements[firstLoginId] = Achievement(
            id: firstLoginId,
            title: "Welcome Aboard!",
            description: "Created your first profile on the learning platform",
            iconUrl: "https://example.com/icons/welcome.png",
            points: 100,
            rarity: "Common"
        )
        self.nextAchievementId = self.nextAchievementId + 1
        
        // First Course Completion
        let firstCourseId = self.nextAchievementId
        self.achievements[firstCourseId] = Achievement(
            id: firstCourseId,
            title: "First Steps",
            description: "Completed your first course",
            iconUrl: "https://example.com/icons/first-course.png",
            points: 500,
            rarity: "Common"
        )
        self.nextAchievementId = self.nextAchievementId + 1
        
        // 1000 Points Achievement
        let pointMasterId = self.nextAchievementId
        self.achievements[pointMasterId] = Achievement(
            id: pointMasterId,
            title: "Point Master",
            description: "Earned 1000 points",
            iconUrl: "https://example.com/icons/point-master.png",
            points: 200,
            rarity: "Rare"
        )
        self.nextAchievementId = self.nextAchievementId + 1
    }
}