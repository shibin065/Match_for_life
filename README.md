**Match4Life – ML-Based Blood Donation Matching Platform**

Match4Life is a full-stack web application that connects hospitals with compatible blood donors during emergencies. It combines machine learning, blood group compatibility, and geographical distance to help prioritize potential donors and streamline blood donation coordination.

**Key Features**
- **Donor Management:** Registration, login, profile management, GPS consent, donation history, and request responses.
- **Hospital Management:** Hospital registration, verification, emergency blood request creation, and candidate review.
- **Machine Learning:** A trained Random Forest classifier estimates donor response propensity using Recency, Frequency, and Time (RFT) features derived from historical donation records.
- **Intelligent Matching:** Filters donors by blood group compatibility and ranks candidates using ML propensity scores and geographical distance.
- **Emergency Requests:** Hospitals can create blood requests, trigger matching, and track donor responses.
- **Notification Tracking:** Records notification status and donor responses through the backend.
- **Medical Screening:** Maintains screening records separately from ML predictions, with final eligibility decisions remaining the responsibility of healthcare professionals.
- **Admin Panel:** Django Admin supports management of donors, hospitals, emergency requests, matches, donation history, and screening records.

**Technology Stack**
- **Frontend:** React, Vite, JavaScript, Axios, React Router
- **Backend:** Python, Django, Django REST Framework
- **Database:** PostgreSQL
- **Machine Learning:** Scikit-learn, Random Forest, Pandas, Joblib
- **UI:** CSS, Lucide React

**Machine Learning Approach**

The model uses Recency (time since the last donation), Frequency (previous donation count), and Time (observation period) to estimate the probability of a positive donor response. Donors without sufficient donation history can still be considered using compatibility rules and geographical distance.

**Objective**

Match4Life aims to reduce manual coordination, improve donor identification, and support data-driven prioritization during blood emergencies through an integrated web platform.

**Disclaimer:** ML predictions estimate response propensity and do not guarantee donor availability, response, or medical eligibility.
