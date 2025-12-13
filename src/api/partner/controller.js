  const Partner = require("../../../models/partner");

  const validateContactFields = (contactFields) => {
    if (!Array.isArray(contactFields) || contactFields.length === 0) {
      return {
        valid: false,
        message: "contactFields must be a non-empty array.",
      };
    }

    for (let field of contactFields) {
      if (!field.label || !field.placeholder || !field.name || !field.type) {
        return {
          valid: false,
          message: "Each contact field must have label, placeholder, name, and type.",
        };
      }

      if (!["text", "email", "tel", "textarea", "number"].includes(field.type)) {
        return {
          valid: false,
          message: `Invalid field type: ${field.type}. Valid: text, email, tel, textarea, number.`,
        };
      }
    }

    return { valid: true };
  };


  exports.create = async (req, res) => {
    try {
      const {
        heading,
        subHeading,
        contactFormTitle,
        contactFields,
        title,
        description,

        metaTitle,
        metaDescription,
        metaKeywords,
        metaImage,
        canonicalUrl,
        jsonLd,
        ogTitle,
        ogDescription,
        ogImage,
        ogType,

        publishedDate,
        lastUpdatedDate,
        showPublishedDate,
        showLastUpdatedDate,

        robots,
        customHead,
        slug,

        redirect,
        breadcrumbs,
        includeInSitemap,
        priority,
        changefreq,

        isScheduled,
        scheduledPublishDate,
        isHidden,
      } = req.body;

      if (!heading || !subHeading || !contactFormTitle || !title || !description) {
        return res.status(400).json({
          success: false,
          message: "Required fields missing: heading, subHeading, contactFormTitle, title, description.",
        });
      }

      const cfValidation = validateContactFields(contactFields);
      if (!cfValidation.valid) {
        return res.status(400).json({ success: false, message: cfValidation.message });
      }

      let imagePath = req.file ? req.file.path : null;

      const partnerData = {
        heading,
        subHeading,
        contactFormTitle,
        contactFields,
        title,
        image: imagePath,
        description,

        metaTitle,
        metaDescription,
        metaKeywords,
        metaImage,
        canonicalUrl,
        jsonLd,
        ogTitle,
        ogDescription,
        ogImage,
        ogType,

        publishedDate,
        lastUpdatedDate,
        showPublishedDate,
        showLastUpdatedDate,

        robots,
        customHead,
        slug,

        redirect,
        breadcrumbs,
        includeInSitemap,
        priority,
        changefreq,

        isScheduled,
        scheduledPublishDate,
        isHidden,
      };

      const partner = await Partner.create(partnerData);

      return res.status(200).json({
        success: true,
        message: "Partner created successfully",
        data: partner,
      });
    } catch (error) {
      console.error("Error creating partner:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  exports.getPartner = async (req, res) => {
    try {
      const partners = await Partner.find().sort({ createdAt: -1 });
      return res.status(200).json({ success: true, data: partners });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  exports.getPartnerById = async (req, res) => {
    try {
      const partner = await Partner.findById(req.params.id);
      if (!partner) {
        return res.status(404).json({ success: false, message: "Partner not found" });
      }
      return res.status(200).json({ success: true, data: partner });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  exports.update = async (req, res) => {
    try {
      const partnerId = req.params.id;
      const partner = await Partner.findById(partnerId);

      if (!partner) {
        return res.status(404).json({ success: false, message: "Partner not found" });
      }

      let updatedData = { ...req.body };

      // Validate contact fields if provided
      if (updatedData.contactFields) {
        const cfValidation = validateContactFields(updatedData.contactFields);
        if (!cfValidation.valid) {
          return res.status(400).json({ success: false, message: cfValidation.message });
        }
      }

      // Handle image
      updatedData.image = req.file ? req.file.path : partner.image;

      const updatedPartner = await Partner.findByIdAndUpdate(partnerId, updatedData, {
        new: true,
        runValidators: true,
      });

      return res.status(200).json({
        success: true,
        message: "Partner updated successfully",
        data: updatedPartner,
      });
    } catch (error) {
      console.error("Error updating partner:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  exports.softDelete = async (req, res) => {
    try {
      const partner = await Partner.findByIdAndUpdate(
        req.params.id,
        { isDeleted: true },
        { new: true }
      );

      if (!partner) {
        return res.status(404).json({ success: false, message: "Partner not found" });
      }

      return res.status(200).json({
        success: true,
        message: "Partner soft deleted",
        data: partner,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  exports.deletePartner = async (req, res) => {
    try {
      const partner = await Partner.findByIdAndDelete(req.params.id);

      if (!partner) {
        return res.status(404).json({ success: false, message: "Partner not found" });
      }

      return res.status(200).json({
        success: true,
        message: "Partner permanently deleted",
        data: partner,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };
