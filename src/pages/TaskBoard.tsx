import { useState } from 'react';
import { Plus, MoreHorizontal, Image as ImageIcon, Link as LinkIcon, CheckCircle2 } from 'lucide-react';
import './TaskBoard.css';

const MOCK_DATA = {
  columns: [
    { id: 'idea', title: 'Ý tưởng', count: 12, color: '#8b5cf6' },
    { id: 'todo', title: 'Việc cần làm', count: 8, color: '#3b82f6' },
    { id: 'doing', title: 'Đang làm', count: 5, color: '#f59e0b' },
    { id: 'waiting', title: 'Đang chờ', count: 3, color: '#ef4444' },
    { id: 'done', title: 'Hoàn thành', count: 15, color: '#10b981' },
  ],
  tasks: {
    idea: [
      { id: 1, title: 'Ý tưởng video: So sánh Vinhomes Q9 và Masteri Centre Point', date: '24/05', tags: ['BĐS', 'So sánh'], hasImage: true },
      { id: 2, title: 'Ý tưởng: 5 lý do nên mua chung cư thay vì nhà phố', date: '22/05', tags: ['BĐS', 'Mẹo'], hasImage: false }
    ],
    todo: [
      { id: 3, title: 'Review tiện ích Vinhomes Q9', date: '25/05', tags: ['Review', 'Tiện ích'], hasImage: true, avatar: true },
      { id: 4, title: 'Update tiến độ Vinhomes Q9 T5/2024', date: '26/05', tags: ['Update'], hasImage: false }
    ],
    doing: [
      { id: 5, title: 'Quay video căn hộ 2PN Vinhomes Q9', date: '24/05', tags: ['Review', 'Căn hộ'], hasImage: true, avatar: true },
      { id: 6, title: 'Thu âm voiceover video phân tích BĐS', date: '24/05', tags: ['Voiceover'], hasImage: true }
    ],
    waiting: [
      { id: 7, title: 'Chờ feedback video review Q9', date: '23/05', tags: ['Feedback'], hasImage: false, avatar: true },
      { id: 8, title: 'Chờ duyệt thumbnail video so sánh Q9', date: '23/05', tags: ['Thumbnail'], hasImage: true }
    ],
    done: [
      { id: 9, title: 'Video review tổng quan Vinhomes Q9', date: '20/05', tags: ['Review'], hasImage: true, completed: true },
      { id: 10, title: 'Viết script video tiện ích nội khu', date: '19/05', tags: ['Script'], hasImage: false, completed: true }
    ]
  }
};

const TaskCard = ({ task, onClick }) => (
  <div className="task-card" onClick={onClick}>
    {task.hasImage && (
      <div className="task-image">
        <div className="img-placeholder"></div>
      </div>
    )}
    <div className="task-content">
      <h4 className="task-title">{task.title}</h4>
      <div className="task-tags">
        {task.tags.map((tag, idx) => {
          let tagClass = 'tag-review';
          if(tag === 'BĐS' || tag === 'Mẹo') tagClass = 'tag-idea';
          if(tag === 'Script' || tag === 'Update') tagClass = 'tag-script';
          if(tag === 'Feedback') tagClass = 'tag-bds';
          return <span key={idx} className={`tag ${tagClass}`}>{tag}</span>
        })}
      </div>
      <div className="task-footer">
        <span className="task-date">{task.date}</span>
        <div className="task-footer-right">
          {task.completed && <CheckCircle2 size={16} className="text-success" />}
          {task.avatar && <img src="https://ui-avatars.com/api/?name=User&background=6366f1&color=fff" className="task-avatar" alt="User" />}
        </div>
      </div>
    </div>
  </div>
);

const TaskBoard = () => {
  const [selectedTask, setSelectedTask] = useState(null);

  const openTaskModal = (task) => {
    setSelectedTask(task);
  };

  const closeModal = () => {
    setSelectedTask(null);
  };

  return (
    <div className="task-board-container animate-fade-in">
      <div className="page-header">
        <h2 className="page-title">Bảng công việc</h2>
        <div className="page-actions">
          <button className="btn-primary">
            <Plus size={18} /> Thêm nhanh
          </button>
        </div>
      </div>

      <div className="kanban-board">
        {MOCK_DATA.columns.map((col) => (
          <div key={col.id} className="kanban-column">
            <div className="column-header">
              <div className="column-title-wrap">
                <span className="column-dot" style={{ backgroundColor: col.color }}></span>
                <h3 className="column-title">{col.title}</h3>
                <span className="column-count">{col.count}</span>
              </div>
              <button className="icon-btn-small"><MoreHorizontal size={16} /></button>
            </div>
            
            <div className="column-cards">
              {MOCK_DATA.tasks[col.id].map(task => (
                <TaskCard key={task.id} task={task} onClick={() => openTaskModal(task)} />
              ))}
            </div>

            <button className="add-card-btn">
              <Plus size={16} /> Thêm thẻ
            </button>
          </div>
        ))}
      </div>

      {selectedTask && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content glass-effect" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Chi tiết công việc</h3>
              <button className="close-btn" onClick={closeModal}>&times;</button>
            </div>
            <div className="modal-body">
              <input type="text" className="modal-input-title" defaultValue={selectedTask.title} placeholder="Tên công việc" />
              
              <div className="modal-section">
                <label>Mô tả</label>
                <textarea className="modal-textarea" placeholder="Nhập mô tả chi tiết..."></textarea>
              </div>
              
              <div className="modal-section">
                <label>Link tham khảo</label>
                <div className="input-group">
                  <LinkIcon size={18} className="input-icon" />
                  <input type="text" className="modal-input" placeholder="https://..." />
                </div>
              </div>
              
              <div className="modal-section">
                <label>Ảnh đính kèm</label>
                <div className="upload-area">
                  <ImageIcon size={32} className="upload-icon" />
                  <span>Kéo thả ảnh hoặc click để tải lên</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-outline" onClick={closeModal}>Hủy</button>
              <button className="btn-primary" onClick={closeModal}>Lưu thay đổi</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskBoard;
