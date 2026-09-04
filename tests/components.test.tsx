import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import AllProjects from '../src/components/react/AllProjects';
import FeaturedProjects from '../src/components/react/FeaturedProjects';
import ProjectCard from '../src/components/react/ProjectCard';
import TypeWriter from '../src/components/react/TypeWriter';
import { featuredProjects, projects, type Project } from '../src/data/projects';

/**
 * 元件層只做 smoke:import 鏈通、用真實資料 render 不炸、關鍵互動有反應。
 * 視覺與動畫效果測不出來也不該在這裡測——那要靠瀏覽器實際看。
 *
 * three/ 底下的元件不在此列:jsdom 沒有 WebGL context,render 必然失敗。
 */
const protectedProject = projects.find((project) => project.visibility === 'protected');
const publicProject = projects.find((project) => project.visibility === 'public')!;

describe('ProjectCard', () => {
  it('render 出專案標題與技術標籤', () => {
    render(<ProjectCard project={publicProject} index={0} />);

    expect(screen.getByText(publicProject.title)).toBeInTheDocument();
    for (const tech of publicProject.tech) {
      expect(screen.getByText(tech)).toBeInTheDocument();
    }
  });

  it('詳情預設收合,點擊後才顯示', async () => {
    const user = userEvent.setup();
    render(<ProjectCard project={publicProject} index={0} />);

    expect(screen.queryByText(publicProject.longDescription)).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /展開詳情/ }));

    expect(screen.getByText(publicProject.longDescription)).toBeInTheDocument();
  });

  it('沒有連結的專案不 render Live Demo', () => {
    const withoutLink: Project = { ...publicProject, link: undefined };
    render(<ProjectCard project={withoutLink} index={0} />);

    expect(screen.queryByText('Live Demo')).not.toBeInTheDocument();
  });

  it('受保護專案的卡片不出現任何對外連結', () => {
    // 客戶案例只談工程方法,卡片上不該有任何能指回客戶的連結。
    // 刻意不做條件式跳過:資料裡一個 protected 專案都不剩時,
    // 這條該失敗提醒護欄已無對象,而不是靜默通過。
    expect(protectedProject, '資料中沒有 protected 專案,此護欄形同虛設').toBeDefined();

    const { container } = render(<ProjectCard project={protectedProject!} index={0} />);
    const externalLinks = container.querySelectorAll('a[target="_blank"]');

    expect(externalLinks).toHaveLength(0);
  });
});

describe('專案列表', () => {
  it('AllProjects render 出每一個專案', () => {
    render(<AllProjects />);

    for (const project of projects) {
      expect(screen.getByText(project.title)).toBeInTheDocument();
    }
  });

  it('FeaturedProjects 只 render 精選專案', () => {
    render(<FeaturedProjects />);

    for (const project of featuredProjects) {
      expect(screen.getByText(project.title)).toBeInTheDocument();
    }

    const notFeatured = projects.filter((project) => !project.featured);
    for (const project of notFeatured) {
      expect(screen.queryByText(project.title)).not.toBeInTheDocument();
    }
  });
});

describe('TypeWriter', () => {
  it('render 不炸,且初始為空字串', () => {
    const { container } = render(<TypeWriter texts={['Hello', 'World']} />);

    expect(container.firstChild).toBeTruthy();
  });
});
