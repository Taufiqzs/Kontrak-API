const fs = require("fs").promises;
const path = require("path");

//   Get banners

exports.getBanners = async (req, res) => {
  try {
    // In production, this would come from a database
    const banners = [
      {
        id: 1,
        title: "BNI Digital Banking",
        description: "Banking services at your fingertips",
        imageUrl: "/images/banners/digital-banking.jpg",
        link: "/services/digital",
        isActive: true,
      },
      {
        id: 2,
        title: "MSME Support Program",
        description: "Grow your business with our financing solutions",
        imageUrl: "/images/banners/msme-support.jpg",
        link: "/services/msme",
        isActive: true,
      },
      {
        id: 3,
        title: "Sustainable Banking",
        description: "Investing in a greener future",
        imageUrl: "/images/banners/sustainability.jpg",
        link: "/services/esg",
        isActive: true,
      },
    ];

    res.json({
      success: true,
      banners: banners.filter((banner) => banner.isActive),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch banners" });
  }
};

//   Get services
//   GET /api/info/services
//Public
exports.getServices = async (req, res) => {
  try {
    const services = [
      {
        id: 1,
        name: "Savings Account",
        icon: "💳",
        description: "Flexible savings with competitive interest",
        features: ["Daily interest", "Free debit card", "Mobile banking"],
        category: "Account",
      },
      {
        id: 2,
        name: "Digital Banking",
        icon: "📱",
        description: "Full banking services on your mobile",
        features: ["Mobile app", "Internet banking", "E-wallet"],
        category: "Digital",
      },
      {
        id: 3,
        name: "Loan Services",
        icon: "💰",
        description: "Personal and business loans",
        features: ["Quick approval", "Flexible terms", "Low interest"],
        category: "Loan",
      },
      {
        id: 4,
        name: "Investment",
        icon: "📈",
        description: "Grow your wealth with our investment products",
        features: ["Mutual funds", "Stocks", "Bonds"],
        category: "Investment",
      },
      {
        id: 5,
        name: "Insurance",
        icon: "🛡️",
        description: "Protect what matters most",
        features: ["Life insurance", "Health insurance", "Property insurance"],
        category: "Insurance",
      },
      {
        id: 6,
        name: "MSME Banking",
        icon: "🏢",
        description: "Specialized services for small businesses",
        features: ["Business loans", "Payment solutions", "Financial advisory"],
        category: "Business",
      },
    ];

    res.json({
      success: true,
      services,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch services" });
  }
};
