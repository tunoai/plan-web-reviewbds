import { useState, useEffect } from 'react';
import { Search, Filter, Plus, Play, Bookmark, Image as ImageIcon, FileText, Trash2 } from 'lucide-react';
import { collection, onSnapshot, query, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './IdeaVault.css';

const MOCK_IDEAS = [
  { id: 1, type: 'video', title: 'Ý tưởng video: Check-in vị trí đẹp Vinhomes Q9', tags: ['BĐS', 'Vị trí'], image: true },
  { id: 2, type: 'text', title: 'Cách lựa chọn căn hộ view đẹp, không bị che chắn tầm nhìn', tags: ['Mẹo', 'Căn hộ'], content: 'Nên chọn các căn hướng Đông Nam, view sông hoặc công viên nội khu. Tránh các căn hướng Tây sát đường lớn...' },
  { id: 3, type: 'video', title: 'Xu hướng sống xanh tại các khu đô thị hiện nay', tags: ['Xu hướng', 'BĐS'], image: true },
  { id: 4, type: 'image', title: 'Phân tích layout căn hộ 2PN Vinhomes Q9', tags: ['Phân tích', 'Layout'], image: true },
  { id: 5, type: 'text', title: '5 yếu tố tăng giá của Vinhomes Q9 trong tương lai', tags: ['Đầu tư', 'Phân tích'], content: '- Hạ tầng vành đai 3\n- Tuyến metro số 1\n- Tiện ích nội khu hoàn thiện\n- TTTM Vincom Megamall...' },
  { id: 6, type: 'image', title: 'Review clubhouse Vinhomes Q9', tags: ['Review', 'Tiện ích'], image: true },
  { id: 7, type: 'link', title: 'Kịch bản TikTok: So sánh giá các phân khu', tags: ['Script', 'TikTok'], link: 'https://tiktok.com/@user/video/123' }
];

const IdeaCard = ({ idea, onDelete }) => {
  return (
    <div className="idea-card break-inside" style={{position: 'relative'}}>
      <button 
        className="icon-btn-small" 
        onClick={() => onDelete(idea.id)}
        style={{position: 'absolute', top: '10px', right: '10px', zIndex: 10, backgroundColor: 'rgba(0,0,0,0.5)', color: 'var(--danger)'}}
      >
        <Trash2 size={16} />
      </button>
      {idea.image && (
        <div className="idea-media">
          <div className="idea-img-placeholder"></div>
          {idea.type === 'video' && (
            <div className="play-icon-overlay">
              <Play size={24} fill="white" />
            </div>
          )}
        </div>
      )}
      
      {!idea.image && idea.type === 'text' && (
        <div className="idea-text-preview">
          <FileText size={24} className="text-muted mb-2" />
          <p>{idea.content}</p>
        </div>
      )}

      <div className="idea-content">
        <h3 className="idea-title">{idea.title}</h3>
        {idea.link && <a href="#" className="idea-link">{idea.link}</a>}
        
        <div className="idea-footer">
          <div className="idea-tags">
            {idea.tags.map((tag, idx) => (
              <span key={idx} className="tag tag-idea">{tag}</span>
            ))}
          </div>
          <button className="bookmark-btn">
            <Bookmark size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

const IdeaVault = () => {
  const categories = ['Tất cả', 'BĐS', 'TikTok', 'Script', 'Mẹo', 'AI'];
  const [activeCat, setActiveCat] = useState('Tất cả');
  const [ideas, setIdeas] = useState(MOCK_IDEAS); // Fallback to mock if empty

  useEffect(() => {
    const q = query(collection(db, 'ideas'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const ideaData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setIdeas(ideaData);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa ý tưởng này?')) {
      try {
        if (typeof id === 'string') { // It's a firebase ID
          await deleteDoc(doc(db, 'ideas', id));
        } else { // Mock data
          setIdeas(ideas.filter(i => i.id !== id));
        }
      } catch (error) {
        console.error("Error deleting idea:", error);
      }
    }
  };

  return (
    <div className="idea-vault animate-fade-in">
      <div className="page-header">
        <div className="header-left">
          <h2 className="page-title">Kho ý tưởng</h2>
        </div>
        <div className="header-right">
          <div className="search-container small">
            <Search size={16} className="search-icon" />
            <input type="text" placeholder="Tìm ý tưởng..." className="search-input" />
            <div className="search-shortcut">⌘ K</div>
          </div>
        </div>
      </div>

      <div className="filter-bar">
        <div className="categories">
          {categories.map(cat => (
            <button 
              key={cat} 
              className={`category-btn ${activeCat === cat ? 'active' : ''}`}
              onClick={() => setActiveCat(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <button className="icon-btn filter-btn">
          <Filter size={18} />
        </button>
      </div>

      <div className="masonry-grid">
        {ideas.map(idea => (
          <IdeaCard key={idea.id} idea={idea} onDelete={handleDelete} />
        ))}
      </div>

      <button className="add-idea-fab shadow-lg">
        <Plus size={24} />
      </button>
    </div>
  );
};

export default IdeaVault;
