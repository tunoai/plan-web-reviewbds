import { useState, useEffect } from 'react';
import { Plus, MoreHorizontal, Image as ImageIcon, Link as LinkIcon, CheckCircle2, Trash2 } from 'lucide-react';
import { collection, addDoc, updateDoc, doc, onSnapshot, query, orderBy, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import './TaskBoard.css';

const COLUMNS = [
  { id: 'idea', title: 'Ý tưởng', color: '#8b5cf6' },
  { id: 'todo', title: 'Việc cần làm', color: '#3b82f6' },
  { id: 'doing', title: 'Đang làm', color: '#f59e0b' },
  { id: 'waiting', title: 'Đang chờ', color: '#ef4444' },
  { id: 'done', title: 'Hoàn thành', color: '#10b981' },
];

const TaskCard = ({ task, onClick }) => (
  <div className="task-card" onClick={onClick}>
    {task.imageUrl && (
      <div className="task-image">
        <img src={task.imageUrl} alt="Cover" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </div>
    )}
    <div className="task-content">
      <div className="task-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
        <h4 className="task-title">{task.title}</h4>
        <button className="icon-btn-small delete-task-btn" onClick={(e) => onClick(e, 'delete')} style={{color: 'var(--danger)', opacity: 0.7, padding: '2px'}}>
          <Trash2 size={14} />
        </button>
      </div>
      <div className="task-tags">
        {(task.tags || []).map((tag, idx) => {
          let tagClass = 'tag-review';
          if(tag === 'BĐS' || tag === 'Mẹo') tagClass = 'tag-idea';
          if(tag === 'Script' || tag === 'Update') tagClass = 'tag-script';
          if(tag === 'Feedback') tagClass = 'tag-bds';
          return <span key={idx} className={`tag ${tagClass}`}>{tag}</span>
        })}
      </div>
      <div className="task-footer">
        <span className="task-date">{task.date || ''}</span>
        <div className="task-footer-right">
          {task.status === 'done' && <CheckCircle2 size={16} className="text-success" />}
        </div>
      </div>
    </div>
  </div>
);

const TaskBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form states
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editLink, setEditLink] = useState('');
  const [editStatus, setEditStatus] = useState('idea');
  const [editImage, setEditImage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'tasks'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const taskData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTasks(taskData);
    });
    return () => unsubscribe();
  }, []);

  const openTaskModal = (task = null, columnId = 'idea') => {
    if (task) {
      setSelectedTask(task);
      setEditTitle(task.title || '');
      setEditDesc(task.description || '');
      setEditLink(task.link || '');
      setEditStatus(task.status || 'idea');
      setEditImage(task.imageUrl || '');
      setIsEditing(true);
    } else {
      setSelectedTask(null);
      setEditTitle('');
      setEditDesc('');
      setEditLink('');
      setEditStatus(columnId);
      setEditImage('');
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Bạn có chắc muốn xóa thẻ này?')) {
      try {
        await deleteDoc(doc(db, 'tasks', id));
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedTask(null);
      setIsEditing(false);
      setEditImage('');
    }, 200);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const storageRef = ref(storage, `tasks_images/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setEditImage(url);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Lỗi khi tải ảnh lên!");
    } finally {
      setIsUploading(false);
    }
  };

  const saveTask = async () => {
    if (!editTitle.trim()) return;

    const taskData = {
      title: editTitle,
      description: editDesc,
      link: editLink,
      status: editStatus,
      imageUrl: editImage,
      tags: [], // Could add tag input later
      date: new Date().toLocaleDateString('vi-VN').substring(0, 5),
    };

    try {
      if (isEditing && selectedTask) {
        const taskRef = doc(db, 'tasks', selectedTask.id);
        await updateDoc(taskRef, taskData);
      } else {
        await addDoc(collection(db, 'tasks'), {
          ...taskData,
          createdAt: serverTimestamp()
        });
      }
      closeModal();
    } catch (error) {
      console.error("Error saving task:", error);
      alert("Có lỗi xảy ra khi lưu công việc");
    }
  };

  // Group tasks by status
  const groupedTasks = COLUMNS.reduce((acc, col) => {
    acc[col.id] = tasks.filter(t => t.status === col.id);
    return acc;
  }, {});

  return (
    <div className="task-board-container animate-fade-in">
      <div className="page-header">
        <h2 className="page-title">Bảng công việc</h2>
        <div className="page-actions">
          <button className="btn-primary" onClick={() => openTaskModal(null, 'idea')}>
            <Plus size={18} /> Thêm nhanh
          </button>
        </div>
      </div>

      <div className="kanban-board">
        {COLUMNS.map((col) => (
          <div key={col.id} className="kanban-column">
            <div className="column-header">
              <div className="column-title-wrap">
                <span className="column-dot" style={{ backgroundColor: col.color }}></span>
                <h3 className="column-title">{col.title}</h3>
                <span className="column-count">{(groupedTasks[col.id] || []).length}</span>
              </div>
              <button className="icon-btn-small"><MoreHorizontal size={16} /></button>
            </div>
            
            <div className="column-cards">
              {(groupedTasks[col.id] || []).map(task => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onClick={(e, action) => {
                    if (action === 'delete') {
                      handleDeleteTask(e, task.id);
                    } else {
                      openTaskModal(task);
                    }
                  }} 
                />
              ))}
            </div>

            <button className="add-card-btn" onClick={() => openTaskModal(null, col.id)}>
              <Plus size={16} /> Thêm thẻ
            </button>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content glass-effect" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{isEditing ? 'Chi tiết công việc' : 'Tạo công việc mới'}</h3>
              <button className="close-btn" onClick={closeModal}>&times;</button>
            </div>
            <div className="modal-body">
              <input 
                type="text" 
                className="modal-input-title" 
                value={editTitle} 
                onChange={e => setEditTitle(e.target.value)}
                placeholder="Tên công việc" 
                autoFocus
              />
              
              <div className="modal-section">
                <label>Trạng thái</label>
                <select 
                  className="modal-select"
                  value={editStatus}
                  onChange={e => setEditStatus(e.target.value)}
                  style={{ background: 'rgba(255,255,255,0.05)', color: 'white', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)', outline: 'none' }}
                >
                  {COLUMNS.map(col => (
                    <option key={col.id} value={col.id}>{col.title}</option>
                  ))}
                </select>
              </div>

              <div className="modal-section">
                <label>Mô tả</label>
                <textarea 
                  className="modal-textarea" 
                  value={editDesc}
                  onChange={e => setEditDesc(e.target.value)}
                  placeholder="Nhập mô tả chi tiết..."
                ></textarea>
              </div>
              
              <div className="modal-section">
                <label>Link tham khảo</label>
                <div className="input-group">
                  <LinkIcon size={18} className="input-icon" />
                  <input 
                    type="text" 
                    className="modal-input" 
                    value={editLink}
                    onChange={e => setEditLink(e.target.value)}
                    placeholder="https://..." 
                  />
                </div>
              </div>
              
              <div className="modal-section">
                <label>Ảnh đính kèm</label>
                {editImage ? (
                  <div style={{position: 'relative', marginTop: '8px'}}>
                    <img src={editImage} alt="Preview" style={{width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px'}} />
                    <button 
                      onClick={() => setEditImage('')}
                      style={{position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer'}}
                    >
                      Xóa ảnh
                    </button>
                  </div>
                ) : (
                  <label className="upload-area" style={{cursor: isUploading ? 'not-allowed' : 'pointer', opacity: isUploading ? 0.5 : 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                    <input type="file" accept="image/*" style={{display: 'none'}} onChange={handleImageUpload} disabled={isUploading} />
                    <ImageIcon size={32} className="upload-icon" />
                    <span>{isUploading ? 'Đang tải lên...' : 'Click để tải ảnh lên'}</span>
                  </label>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-outline" onClick={closeModal}>Hủy</button>
              <button className="btn-primary" onClick={saveTask}>Lưu thay đổi</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskBoard;
