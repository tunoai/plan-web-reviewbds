import { CheckSquare, Film, Clock, Lightbulb, Calendar, CheckCircle2 } from 'lucide-react';
import './Dashboard.css';

const StatCard = ({ title, count, subtitle, icon: Icon, colorClass }) => (
  <div className={`stat-card ${colorClass}`}>
    <div className="stat-icon-wrapper">
      <Icon size={24} className="stat-icon" />
    </div>
    <div className="stat-content">
      <h3 className="stat-title">{title}</h3>
      <div className="stat-value">
        <span className="stat-count">{count}</span>
        <span className="stat-label">{subtitle}</span>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  return (
    <div className="dashboard animate-fade-in">
      <div className="page-header">
        <h2 className="page-title">Tổng quan</h2>
        <div className="header-date">Thứ Sáu, 24 Tháng 5, 2024</div>
      </div>

      <div className="stats-grid">
        <StatCard 
          title="Việc hôm nay" 
          count="6" 
          subtitle="công việc | 2 việc quan trọng" 
          icon={CheckSquare} 
          colorClass="primary-card"
        />
        <StatCard 
          title="Video cần làm" 
          count="4" 
          subtitle="video | 1 video đang quay" 
          icon={Film} 
          colorClass="danger-card"
        />
        <StatCard 
          title="Công việc quá hạn" 
          count="3" 
          subtitle="công việc | Cần xử lý gấp" 
          icon={Clock} 
          colorClass="warning-card"
        />
        <StatCard 
          title="Ý tưởng mới" 
          count="8" 
          subtitle="ý tưởng | Trong 7 ngày qua" 
          icon={Lightbulb} 
          colorClass="success-card"
        />
        <StatCard 
          title="Nội dung tuần này" 
          count="5" 
          subtitle="video | 3 đã hoàn thành" 
          icon={Calendar} 
          colorClass="info-card"
        />
      </div>

      <div className="dashboard-grid-bottom">
        <div className="dashboard-card project-progress">
          <h3 className="card-title">Tiến độ tổng dự án</h3>
          <div className="progress-header">
            <span className="project-name"><FolderIcon /> Dự án Vinhomes Q9</span>
            <span className="progress-percentage">72%</span>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: '72%' }}></div>
          </div>
          <div className="progress-stats">
            <div className="progress-stat">
              <span className="stat-num info-text">36</span>
              <span className="stat-text">Hoàn thành</span>
            </div>
            <div className="progress-stat">
              <span className="stat-num primary-text">12</span>
              <span className="stat-text">Đang làm</span>
            </div>
            <div className="progress-stat">
              <span className="stat-num warning-text">8</span>
              <span className="stat-text">Việc cần làm</span>
            </div>
            <div className="progress-stat">
              <span className="stat-num danger-text">5</span>
              <span className="stat-text">Đang chờ</span>
            </div>
          </div>
        </div>

        <div className="dashboard-card recent-activities">
          <h3 className="card-title">Hoạt động gần đây</h3>
          <ul className="activity-list">
            <li className="activity-item">
              <CheckCircle2 size={16} className="activity-icon text-success" />
              <span>Bạn đã hoàn thành công việc "Edit video review Q9"</span>
            </li>
            <li className="activity-item">
              <CheckCircle2 size={16} className="activity-icon text-muted" />
              <span>Bạn đã lưu ý tưởng mới từ TikTok</span>
            </li>
            <li className="activity-item">
              <CheckCircle2 size={16} className="activity-icon text-muted" />
              <span>Bạn đã cập nhật công việc "Quay video tiện ích dự án"</span>
            </li>
          </ul>
        </div>

        <div className="dashboard-card upcoming-events">
          <h3 className="card-title">Lịch sắp tới</h3>
          <div className="event-list">
            <div className="event-item">
              <div className="event-date">
                <span className="date-day">25</span>
                <span className="date-month">Th5</span>
              </div>
              <div className="event-details">
                <div className="event-title">Quay video review căn hộ 2PN</div>
                <div className="event-time">09:00 - 11:00</div>
              </div>
            </div>
            <div className="event-item">
              <div className="event-date text-idea">
                <span className="date-day">26</span>
                <span className="date-month">Th5</span>
              </div>
              <div className="event-details">
                <div className="event-title">Edit video tiện ích nội khu</div>
                <div className="event-time">14:00 - 16:00</div>
              </div>
            </div>
          </div>
          <button className="view-all-btn">Xem lịch đầy đủ</button>
        </div>
      </div>
    </div>
  );
};

const FolderIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-folder"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/></svg>
);

export default Dashboard;
