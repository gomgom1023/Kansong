import { getDoc, doc, runTransaction, collection, onSnapshot, addDoc, updateDoc, deleteDoc, writeBatch, getDocs, increment } from "firebase/firestore";
import { create } from 'zustand';
import { db, storage } from '../../../firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import useAuthStore from "./useAuthStore";

const useBoardState = create((set,get) => ({
    boards: [], // 게시판 데이터
    searchBoards:[],//검색된 게시판 데이터
    noticeBoards: [], // 공지사항 초기값을 빈 배열로 설정
    newsBoards: [], // 보도자료 초기값도 빈 배열로 설정
    allBoards:[],
    currentPage: 1, // 현재 페이지
    currentGroup: 1, // 현재 그룹
    boardPerPage: 5, // 페이지당 게시물 수
    unsubscribe: null, // Firestore 구독 해제를 위한 상태
    searchQuery:'',//검색어
    searchCategory:'전체',//검색 카테고리(전체,제목,내용)

    noticeBoard : [],
    newsBoard : [],

    tabs : [
      { to: "/TotalBoard", label:'전체'},
      { to: "/Notice", label:'공지사항'},
      { to: "/News", label:'보도뉴스'},
    ],

    setSearchQuery: (query) => set({searchQuery:query}),
    setSearchCategory: (category) => set({searchCategory: category}),

    paginatedNoticeBoards: () => {
      const { noticeBoards, currentPage, boardPerPage } = get();
      const startIndex = (currentPage - 1) * boardPerPage;
      return noticeBoards.slice(startIndex, startIndex + boardPerPage);
    },

    paginatedNewsBoards: () => {
      const { newsBoards, currentPage, boardPerPage } = get();
      const startIndex = (currentPage - 1) * boardPerPage;
      return newsBoards.slice(startIndex, startIndex + boardPerPage);
    },

    getAllBoards: () => {
      const { noticeBoards, newsBoards, currentPage, boardPerPage } = get();
    
      // ✅ 공지사항과 보도자료 통합 후 최신순 정렬 (createdAt 안전 변환 적용)
      const allBoards = [...noticeBoards, ...newsBoards]
        .map(board => ({
          ...board,
          createdAt: board.createdAt && board.createdAt.seconds
            ? new Date(board.createdAt.seconds * 1000)  // Firestore Timestamp 변환
            : board.createdAt instanceof Date
            ? board.createdAt  // 이미 Date 객체인 경우 그대로 사용
            : new Date(0) // 🔥 createdAt이 없을 경우 기본값 설정
        }))
        .sort((a, b) => b.createdAt - a.createdAt); // 최신순 정렬
    
      const startIndex = (currentPage - 1) * boardPerPage;
      return allBoards.slice(startIndex, startIndex + boardPerPage);
    },
      
    // ✅ 공지사항 게시판 데이터 가져오기
    getNoticeBoards: () => {
      const { noticeBoards } = get();
      return noticeBoards;
    },

    // ✅ 보도자료 게시판 데이터 가져오기
    getNewsBoards: () => {
        const { newsBoards } = get();
        return newsBoards;
    },

    initializeBoards: async () => {
        const { unsubscribe } = get();
        if (unsubscribe) {
            unsubscribe(); // 🔥 기존 구독 해제
        }
    
        console.log("🔥 Firestore 데이터 로딩 시작");
    
        const convertTimestamp = (timestamp) => {
            if (!timestamp) return new Date(0);
            if (timestamp.toDate) return timestamp.toDate();
            if (timestamp.seconds) return new Date(timestamp.seconds * 1000);
            return timestamp instanceof Date ? timestamp : new Date(0);
        };
    
        // 🔥 공지사항 (Notice) 및 보도자료 (News) 데이터 저장할 변수
        let updatedNotice = [];
        let updatedNews = [];
    
        // ✅ 공지사항 (Notice) 데이터 구독
        const unsubscribeNotice = onSnapshot(collection(db, "Notice"), (noticeSnapshot) => {
            updatedNotice = noticeSnapshot.docs.map((doc) => ({
                firestoreId: doc.id,
                ...doc.data(),
                label: doc.data().label || "공지",
                count: doc.data().count ?? 0,
                createdAt: convertTimestamp(doc.data().createdAt), // ✅ Timestamp 변환 적용
            })).sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
    
            console.log("📌 정렬된 공지사항 데이터:", updatedNotice);
    
            // ✅ 최신 데이터로 boards 업데이트
            set((state) => ({
                noticeBoards: updatedNotice,
                newsBoards: state.newsBoards, // 기존 뉴스 데이터 유지
                boards: [...updatedNotice, ...state.newsBoards].sort((a, b) => b.createdAt - a.createdAt),
            }));
        });
    
        // ✅ 보도자료 (News) 데이터 구독
        const unsubscribeNews = onSnapshot(collection(db, "News"), (newsSnapshot) => {
            updatedNews = newsSnapshot.docs.map((doc) => ({
                firestoreId: doc.id,
                ...doc.data(),
                label: doc.data().label || "보도",
                count: doc.data().count ?? 0,
                createdAt: convertTimestamp(doc.data().createdAt), // ✅ Timestamp 변환 적용
            })).sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
    
            console.log("📌 정렬된 보도뉴스 데이터:", updatedNews);
    
            // ✅ 최신 데이터로 boards 업데이트
            set((state) => ({
                noticeBoards: state.noticeBoards, // 기존 공지사항 데이터 유지
                newsBoards: updatedNews,
                boards: [...state.noticeBoards, ...updatedNews].sort((a, b) => b.createdAt - a.createdAt),
            }));
        });
    
        // ✅ Firestore 구독 해제 저장
        setTimeout(() => {
            set({ unsubscribe: () => { unsubscribeNotice(); unsubscribeNews(); } });
        }, 100); // 🔥 setTimeout으로 실행 순서 오류 방지
    },
      

  // ✅ 날짜 변환 함수 추가
  convertCreatedAt: (board) => {
    if (!board?.createdAt) return null;

    if (board.createdAt?.seconds) {
        return new Date(board.createdAt.seconds * 1000);
    }
    if (board.createdAt?.toDate) {
        return board.createdAt.toDate();
    }
    if (board.createdAt instanceof Date) {
        return board.createdAt;
    }
    if (typeof board.createdAt === "string") {
        return new Date(board.createdAt);
    }
    return null;
  },

  fetchContents: async (board) => {
    console.log("📌 [fetchContents] 실행됨 - board:", board);

    if (board.contents) {
        console.log("✅ [fetchContents] 직접 내용 반환");
        return board.contents;
    }
    if (board.contentsURL) {
        try {
            console.log("🌐 [fetchContents] Storage에서 가져오기 - URL:", board.contentsURL);
            const response = await fetch(board.contentsURL);
            const text = await response.text();
            console.log("✅ [fetchContents] 가져온 데이터:", text);
            return text;
        } catch (error) {
            console.error("❌ Storage에서 내용 불러오기 실패:", error);
            return "";
        }
    }
    console.warn("⚠ [fetchContents] contentsURL이 존재하지 않음");
    return "";
  },

   // ✅ 검색 결과 변환 (createdAt 변환 + 제목/내용 필터링)
   transformSearchResults: async (searchResults, searchQuery, searchCategory) => {
    if (!searchQuery) return searchResults; // ✅ 검색어 없으면 기존 데이터 반환

    const lowerQuery = searchQuery.toString().toLowerCase().trim();

    // 🔥 모든 게시글의 내용을 가져오는 비동기 처리 (contents 포함)
    const updatedBoards = await Promise.all(
        searchResults.map(async (board) => ({
            ...board,
            title: board.title || "", // ✅ title 기본값 처리
            contents: board.contents || "", // ✅ contents 기본값 처리
            contents: await get().fetchContents(board),
            createdAt: get().convertCreatedAt(board)
        }))
    );

    // 🔥 검색 필터 적용 (부분 일치 검색)
    const filteredBoards = updatedBoards.filter((board) => {
        const title = board.title.toLowerCase().trim(); // ✅ title이 항상 문자열이도록 보장
        const contents = board.contents.toLowerCase().trim(); // ✅ contents도 문자열로 보장

        return searchCategory === "전체"
            ? title.includes(lowerQuery) || contents.includes(lowerQuery)
            : searchCategory === "제목"
            ? title.includes(lowerQuery)
            : contents.includes(lowerQuery);
    });

    return filteredBoards.sort((a, b) => b.createdAt - a.createdAt); // 🔥 최신순 정렬
  },


  // ✅ HTML 태그 제거 함수 (내용 검색 시 HTML 태그 제거)
  stripHtml: (html) => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, ""); // 🔥 HTML 태그 제거
},

// ✅ 정확한 검색어 포함 여부 체크
containsExactQuery: (text, query) => {
    if (!text) return false;
    return text.includes(query); // 🔥 정확한 문자열 포함 여부 검사
},

searchBoardsByQuery: async () => {
    const { boards, searchQuery, searchCategory, fetchContents, convertCreatedAt, stripHtml } = get();

    if (!searchQuery.trim()) {
        set({ searchBoards: boards });
        return boards || [];
    }

    const lowerQuery = searchQuery.toLowerCase().trim();
    console.log(`🔍 검색어: "${lowerQuery}", 검색 카테고리: "${searchCategory}"`);

    const updatedBoards = await Promise.all(
        boards.map(async (board) => {
            let contents = board.contents ? stripHtml(board.contents).toLowerCase().trim() : "";

            if (board.contentsURL) {
                contents = stripHtml(await fetchContents(board)).toLowerCase().trim();
            }

            return {
                ...board,
                title: stripHtml(board.title || "").toLowerCase().trim(),  // 🔥 제목 정제 후 비교
                contents: contents,  // 🔥 내용 정제 후 비교
                createdAt: convertCreatedAt(board) || new Date(0),
            };
        })
    );

    // 🔥 필터링 (제목 & 내용 구분 적용)
    const filteredBoards = updatedBoards.filter((board) => {
        const title = board.title || "";
        const contents = board.contents || "";

        if (searchCategory === "전체") {
            return title.includes(lowerQuery) || contents.includes(lowerQuery);
        }
        if (searchCategory === "제목") {
            return title.includes(lowerQuery);
        }
        if (searchCategory === "내용") {
            return contents.includes(lowerQuery);
        }
        return false;
    });

    set({ searchBoards: filteredBoards });

    console.log("🔍 필터링된 검색 결과:", filteredBoards);
    return filteredBoards || [];
},
    // Firestore 구독 해제
    cleanUpBoards: () => {
      const { unsubscribe } = get();
      if (unsubscribe) {
        unsubscribe();
        set({ unsubscribe: null });
      }
    },

    setBoards: (newBoards) =>
      set(() => ({
        boards: newBoards,
        noticeBoards: newBoards.filter((board) => board.category === "공지사항"),
        newsBoards: newBoards.filter((board) => board.category === "보도뉴스"),
    })),

    setCurrentPage : (page) => set({ currentPage:page }),

    setCurrentGroup : (group) => set({ currentGroup:group }),
    
    // 전역 순번 계산 함수: 페이지 번호와 boardPerPage를 반영하여 전체 순번 계산
    getGlobalIndex: (localIndex) => {
      const { currentPage, boardPerPage } = get();
      return (currentPage - 1) * boardPerPage + localIndex + 1;
    },

    incrementViewCount: async (boardId, category) => {
        console.log(`🔥 [incrementViewCount] 실행됨 - boardId: ${boardId}, category: ${category}`);

        if (!boardId || !category) {
            console.error("❌ [incrementViewCount] 오류: boardId 또는 category가 없음!");
            return null;
        }
    
        const collectionName = category === "공지사항" ? "Notice" : "News";
        const boardRef = doc(db, collectionName, boardId);
    
        try {
            console.log(`📌 Firestore 조회수 증가 실행 - 문서 ID: ${boardId}`);
    
            // ✅ `increment(1)`을 그대로 사용
            await updateDoc(boardRef, { count: increment(1) });
    
            console.log("✅ Firestore 조회수 증가 완료!");
        } catch (error) {
            console.error("❌ Firestore 조회수 증가 실패:", error);
        }
    },

    titleClick: async (navigate, board) => {
        if (!board || !board.firestoreId) {
            console.error("❌ [titleClick] 오류: 게시글 정보가 올바르지 않습니다.", board);
            return;
        }
    
        const firestoreId = board.firestoreId;
        console.log("🟢 [titleClick] 실행됨 - Firestore 문서 ID:", firestoreId);
    
        // ✅ Firestore에서 조회수 증가 실행
        await get().incrementViewCount(firestoreId, board.category);
    
        // ✅ Firestore에서 최신 count 값을 가져옴
        const updatedBoard = await get().getBoardById(firestoreId);
    
        if (updatedBoard) {
            navigate(`/BoardView/${firestoreId}`, {
                state: { 
                    board: updatedBoard, // 🔥 최신 count 반영
                    skipIncrement: true // ✅ BoardView에서 중복 증가 방지
                }
            });
        } else {
            console.error("❌ Firestore에서 게시글을 가져오는 데 실패함.");
        }
    },    


  getActiveTab : (currentPath) => {
    const tabs = get().tabs;
    return tabs.find((tab) => tab.to === currentPath)?.label || '전체'
  },

   // 총 페이지 계산
  getTotalPages: () => {
    const { boards, boardPerPage } = get();
    return Math.ceil(boards.length / boardPerPage); // 전체 페이지 수
  },

  // 추가: 공지사항의 총 페이지 수 계산
  getTotalPagesForNotice: () => {
    const { noticeBoards, boardPerPage } = get();
    return Math.ceil(noticeBoards.length / boardPerPage);
  },

  // 추가: 보도뉴스의 총 페이지 수 계산
  getTotalPagesForNews: () => {
    const { newsBoards, boardPerPage } = get();
    return Math.ceil(newsBoards.length / boardPerPage);
  },

   // 추가: 검색리스트의 총 페이지 수 계산
   getTotalPagesForSearchBoard: () => {
    const { newsBoards, boardPerPage } = get();
    return Math.ceil(newsBoards.length / boardPerPage);
  },

  // 현재 페이지 데이터
  getPaginatedBoards: () => {
      const { boards, currentPage, boardPerPage } = get();
      const startIndex = (currentPage - 1) * boardPerPage;
      const endIndex = startIndex + boardPerPage;
      return boards.slice(startIndex, endIndex);
  },

  // 현재 페이지 설정
  setCurrentPage: (page) => set((state) => {
    const totalPages = get().getTotalPages();
    // 데이터가 없으면 totalPages가 0이므로 기본값 1을 반환
    if (totalPages === 0) {
      return { currentPage: 1 };
    }
    // 페이지 번호를 1과 totalPages 사이로 클램핑(clamp)
    const newPage = Math.min(Math.max(page, 1), totalPages);
    return { currentPage: newPage };
  }),

  // 이전 그룹으로 이동
  goToPreviousGroup: () => {
      const { currentPage, boardPerPage } = get();
      const newPage = Math.max(currentPage - boardPerPage, 1);
      set({ currentPage: newPage });
  },

  // 다음 그룹으로 이동
  goToNextGroup: () => {
      const { currentPage, boardPerPage } = get();
      const totalPages = get().getTotalPages();
      const newPage = Math.min(currentPage + boardPerPage, totalPages);
      set({ currentPage: newPage });
  },

  // 이전 페이지
  goToPreviousPage: () => {
      const { currentPage } = get();
      if (currentPage > 1) {
          set({ currentPage: currentPage - 1 });
      } else {
          alert("이전 페이지가 없습니다.");
      }
  },

  // 다음 페이지
  goToNextPage: () => {
      const { currentPage } = get();
      const totalPages = get().getTotalPages();
      if (currentPage < totalPages) {
          set({ currentPage: currentPage + 1 });
      } else {
          alert("다음 페이지가 없습니다.");
      }
  },

  getPreviousNextBoards: (currentId) => {
    const { boards } = get();

    console.log("🔥 현재 Board 리스트 (boards):", boards);
    console.log("🔍 현재 조회하는 게시글 ID:", currentId);

    const sortedBoards = [...boards].sort((a, b) => b.createdAt - a.createdAt);
    console.log("📌 정렬된 Boards:", sortedBoards);

    const index = sortedBoards.findIndex(board => board.firestoreId === currentId);

    if (index === -1) {
        console.warn(`⚠ getPreviousNextBoards: 게시글을 찾을 수 없습니다. ID: ${currentId}`);
        return { prevBoard: null, nextBoard: null };
    }

    console.log("✅ 현재 게시글 위치:", index);

    return {
        prevBoard: index > 0 ? sortedBoards[index - 1] : null,
        nextBoard: index < sortedBoards.length - 1 ? sortedBoards[index + 1] : null,
    };
  },

  getBoardById: async (id) => {
    console.log(`📌 Firestore에서 ${id} 조회 중...`);

    const collections = ["Notice", "News"];

    // ✅ Notice와 News 컬렉션을 동시에 조회하여 존재하는 문서 반환
    const results = await Promise.allSettled(
        collections.map(async (col) => {
            const docSnap = await getDoc(doc(db, col, id));
            if (docSnap.exists()) {
                console.log(`✅ Firestore에서 게시글 찾음 - 컬렉션: ${col}, ID: ${id}`);
                return { firestoreId: docSnap.id, ...docSnap.data() };
            }
            return null;
        })
    );

    // ✅ 존재하는 문서 찾기
    const foundBoard = results.find((result) => result.status === "fulfilled" && result.value);
    
    if (foundBoard) {
        return foundBoard.value;
    }

    console.error(`❌ Firestore 문서 ${id} 찾을 수 없음`);
    return null;
  },


  createBoard: async ({ title, contents, category, file }) => {
    try {
        const user = auth.currentUser;
        if (!user) {
            alert("로그인이 필요합니다.");
            throw new Error("유저가 로그인되어 있지 않음");
        }

        await useAuthStore.getState().fetchUserRole(user); // ✅ 관리자 권한 확인
        const { isAdmin } = useAuthStore.getState();
        if (!isAdmin) {
            alert("관리자만 게시글을 작성할 수 있습니다.");
            return;
        }

        let fileURL = "첨부파일 없음";
        let contentsURL = null;

        // 🔥 파일 업로드 (첨부파일 존재할 경우)
        if (file && typeof file !== "string") {
            const storageRef = ref(storage, `boardFiles/${Date.now()}_${file.name}`);
            await uploadBytes(storageRef, file);
            fileURL = await getDownloadURL(storageRef);
        }

        // 🔥 HTML 파일로 변환하여 Storage에 저장 + `contents` 직접 Firestore에 저장
        if (contents.trim()) {
            try {
                const contentsBlob = new Blob([contents], { type: "text/html" });
                const contentsRef = ref(storage, `contents/${Date.now()}.html`);
                console.log("🚀 컨텐츠 HTML 파일 저장 시작...");
                await uploadBytes(contentsRef, contentsBlob);
                contentsURL = await getDownloadURL(contentsRef);
                console.log("✅ 컨텐츠 HTML 파일 저장 완료:", contentsURL);
            } catch (error) {
                console.error("🚨 컨텐츠 저장 실패:", error);
            }
        }

        const collectionName = category === "보도뉴스" ? "News" : "Notice";
        const boardData = {
            title,
            contents, // ✅ Firestore에도 `contents` 직접 저장
            contentsURL, // ✅ HTML 파일 경로도 저장 (필요할 경우 활용)
            category,
            label: category === "보도뉴스" ? "보도" : "공지",
            file: fileURL !== "첨부파일 없음" ? fileURL : null,
            count: 0,
            createdAt: doc.data().createdAt?.toDate 
                    ? doc.data().createdAt.toDate() 
                    : doc.data().createdAt?.seconds
                    ? new Date(doc.data().createdAt.seconds * 1000)
                    : null,
        };

        await addDoc(collection(db, collectionName), boardData);

        alert("게시글이 등록되었습니다.");
    } catch (error) {
        console.error("❌ 게시글 등록 실패:", error);
    }
  },

  updateBoard: async (boardId, { title, contents, category, file }) => {
    try {
        console.log(`🛠 [updateBoard] 게시글 업데이트 시작 - ID: ${boardId}`);

        const state = get();
        const board = state.boards.find((b) => b.firestoreId === boardId);
        if (!board) {
            console.error(`❌ [updateBoard] 게시글을 찾을 수 없습니다. ID: ${boardId}`);
            alert("게시글을 찾을 수 없습니다.");
            return;
        }

        console.log("📌 기존 데이터:", board);

        let fileURL = board.file || "첨부파일 없음";  
        let contentsURL = board.contentsURL || null;
        let contentsText = contents.trim() || "";  

        // 🔥 파일 업로드
        if (file && typeof file !== "string") {
            try {
                const storageRef = ref(storage, `attachments/${Date.now()}_${file.name}`);
                console.log("🚀 파일 업로드 시작:", file.name);
                await uploadBytes(storageRef, file);
                fileURL = await getDownloadURL(storageRef);
                console.log("✅ 파일 업로드 완료:", fileURL);
            } catch (error) {
                console.error("🚨 파일 업로드 실패:", error);
            }
        }

        // ✅ Storage에 HTML 파일 저장
        if (contentsText) {
            try {
                const contentsBlob = new Blob([contentsText], { type: "text/html" });
                const contentsRef = ref(storage, `contents/${boardId}_${Date.now()}.html`);
                console.log("🚀 컨텐츠 HTML 파일 저장 시작...");
                await uploadBytes(contentsRef, contentsBlob);
                contentsURL = await getDownloadURL(contentsRef);
                console.log("✅ 컨텐츠 HTML 파일 저장 완료:", contentsURL);
            } catch (error) {
                console.error("🚨 컨텐츠 저장 실패:", error);
            }
        }

        const collectionName = board.category === "공지사항" ? "Notice" : "News";
        const boardRef = doc(db, collectionName, boardId);

        const updatedData = {
            title,
            contents: contentsText,  // ✅ Firestore에 직접 `contents` 저장
            contentsURL,  // ✅ Storage URL 저장
            category,
            file: fileURL !== "첨부파일 없음" ? fileURL : null,  
            label: board.label,  
            count: board.count,  
        };

        console.log("📌 업데이트할 데이터:", updatedData);

        // ✅ Firestore 업데이트 시도
        await updateDoc(boardRef, updatedData);

        // 🔥 Firestore에서 업데이트된 데이터 확인 (디버깅용)
        const updatedDoc = await getDoc(boardRef);
        console.log("✅ Firestore에서 확인한 업데이트된 데이터:", updatedDoc.data());

        // ✅ Zustand 상태 강제 최신화
        console.log("🔄 Firestore 데이터 최신화...");
        await get().initializeBoards(); 

        console.log(`✅ [updateBoard] 게시글 업데이트 완료 - ID: ${boardId}`);
        alert("게시글이 수정되었습니다.");

        // ✅ `navigate` 실행 후 `fetchBoard()`가 다시 실행되도록 처리
        navigate(`/BoardView/${boardId}`, { state: { updated: true } });

    } catch (error) {
        console.error("❌ [updateBoard] 게시글 수정 실패:", error);
        alert("게시글 수정 중 오류가 발생했습니다.");
    }
},
    deleteBoard: async (boardId) => {
      const { isAdmin } = useAuthStore.getState();
      if (!isAdmin) {
          alert("관리자만 삭제할 수 있습니다.");
          return;
      }

      try {
          console.log(`🛑 [deleteBoard] 삭제 요청 - 문서 ID: ${boardId}`);

          // 🔍 Notice 컬렉션에서 먼저 검색
          let boardRef = doc(db, "Notice", boardId);
          let boardSnap = await getDoc(boardRef);

          if (!boardSnap.exists()) {
              // 🔍 News 컬렉션에서 검색
              boardRef = doc(db, "News", boardId);
              boardSnap = await getDoc(boardRef);
          }

          if (!boardSnap.exists()) {
              console.error(`❌ Firestore 문서 ID를 찾을 수 없음! boardId: ${boardId}`);
              alert("게시글을 찾을 수 없습니다.");
              return;
          }

          // 🔥 Firestore 문서 삭제
          await deleteDoc(boardRef);
          console.log(`✅ Firestore 문서 삭제 완료: ${boardId}`);

          // ✅ Firestore 데이터 최신화
          setTimeout(() => {
              get().initializeBoards();
              console.log("🔄 Firestore 데이터 새로 불러옴");
          }, 1000);

          alert("게시글이 삭제되었습니다.");
      } catch (error) {
          console.error("❌ [deleteBoard] 게시글 삭제 실패:", error);
          alert("삭제 중 오류가 발생했습니다.");
      }
  },

  deleteSelectedBoards: async (boardIds) => {
    const { isAdmin } = useAuthStore.getState();
    if (!isAdmin) {
        alert("관리자만 삭제할 수 있습니다.");
        return;
    }

    try {
        console.log(`🛑 [deleteSelectedBoards] 삭제 요청 - 총 ${boardIds.length}개`);

        // 🔥 Firestore에서 직접 조회해서 컬렉션 결정
        const deletePromises = boardIds.map(async (boardId) => {
            // 🔍 Notice 컬렉션에서 먼저 검색
            let boardRef = doc(db, "Notice", boardId);
            let boardSnap = await getDoc(boardRef);

            if (!boardSnap.exists()) {
                // 🔍 News 컬렉션에서 검색
                boardRef = doc(db, "News", boardId);
                boardSnap = await getDoc(boardRef);
            }

            if (!boardSnap.exists()) {
                console.error(`❌ Firestore 문서 ID를 찾을 수 없음! boardId: ${boardId}`);
                return;
            }

            // 🔥 Firestore 문서 삭제
            await deleteDoc(boardRef);
            console.log(`✅ Firestore 문서 삭제 완료: ${boardId}`);
        });

        await Promise.all(deletePromises);
        console.log("✅ [deleteSelectedBoards] Firestore에서 선택 삭제 완료");

        // ✅ Firestore 데이터 최신화 (UI 업데이트)
        setTimeout(() => {
            get().initializeBoards();
            console.log("🔄 Firestore 데이터 새로 불러옴");
        }, 1000);

        alert("선택된 게시글들이 삭제되었습니다.");
    } catch (error) {
        console.error("❌ [deleteSelectedBoards] Firestore에서 선택 삭제 실패:", error);
        alert("삭제 중 오류가 발생했습니다.");
    }
  },

  deleteAllBoards: async () => {
    const { isAdmin } = useAuthStore.getState();
    if (!isAdmin) {
        alert("관리자만 삭제할 수 있습니다.");
        return;
    }
  
    try {
        console.log("🛑 [deleteAllBoards] 전체 삭제 요청");
  
        // Firestore 배치 초기화
        const batch = writeBatch(db);
  
        // ✅ Notice 컬렉션 전체 삭제
        const noticeSnapshot = await getDocs(collection(db, "Notice"));
        noticeSnapshot.forEach((doc) => batch.delete(doc.ref));
  
        // ✅ News 컬렉션 전체 삭제
        const newsSnapshot = await getDocs(collection(db, "News"));
        newsSnapshot.forEach((doc) => batch.delete(doc.ref));
  
        // 🔥 Firestore 배치 실행
        await batch.commit();
        console.log("✅ Firestore 전체 게시글 삭제 완료");
  
        // ✅ Firestore 데이터 최신화
        setTimeout(() => {
            get().initializeBoards();
            console.log("🔄 Firestore 데이터 새로 불러옴");
        }, 1000);
  
        alert("모든 게시글이 삭제되었습니다.");
    } catch (error) {
        console.error("❌ [deleteAllBoards] Firestore 전체 삭제 실패:", error);
        alert("전체 삭제 중 오류가 발생했습니다.");
    }
  },
  
})) 
    

export default useBoardState;