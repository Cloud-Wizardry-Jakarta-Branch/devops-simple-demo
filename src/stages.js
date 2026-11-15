export const STAGES = [
  {
    id: 'commit',
    title: 'commit',
    subtitle: 'branch fitur',
    detail:
      'Perubahan dikerjakan di branch sendiri, lalu diajukan lewat pull request. Di LKS, branch protection mewajibkan pull request sebelum kode masuk ke main. Di repo demo ini, aturan itu diaktifkan lewat Settings, Branches.',
    service: 'GitHub',
  },
  {
    id: 'ci',
    title: 'CI',
    subtitle: 'lint · build · test',
    detail:
      'Setiap pull request memicu workflow ini. ESLint memeriksa gaya penulisan, Vitest menjalankan pengujian, dan Vite memastikan aplikasi bisa dibangun.',
    service: 'GitHub Actions',
  },
  {
    id: 'image',
    title: 'image',
    subtitle: 'paket aplikasi',
    detail:
      'Hasil build dikemas menjadi artefak. Di LKS, langkah ini membangun image container yang berisi aplikasi dan seluruh dependensinya.',
    service: 'Docker',
  },
  {
    id: 'push',
    title: 'push',
    subtitle: 'registry',
    detail:
      'Artefak disimpan di registry dengan tag versi. Di modul LKS, image didorong ke Amazon ECR dan dipindai kerentanannya.',
    service: 'Amazon ECR',
  },
  {
    id: 'deploy',
    title: 'deploy',
    subtitle: 'ke tujuan akhir',
    detail:
      'Setelah merge ke main, artefak yang sama diantarkan ke lingkungan tujuan. Di modul LKS tujuannya Lambda untuk API dan Amplify untuk frontend.',
    service: 'Lambda · Amplify',
  },
  {
    id: 'verify',
    title: 'verify',
    subtitle: 'endpoint dan log',
    detail:
      'Langkah terakhir memeriksa hasilnya, bukan hanya status workflow. Kalau health check gagal, rollback mengembalikan versi sebelumnya.',
    service: 'CloudWatch',
  },
]
