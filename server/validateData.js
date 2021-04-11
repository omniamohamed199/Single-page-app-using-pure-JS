export function validateData(formData) {
    // const author_name = formData.get('author_name')
    // const author_email = formData.get('author_email')
    const topic_title = formData.get('topic_title')
    const topic_details = formData.get('topic_details')
    // if (!author_name) {    
    //   document.querySelector('[name=author_name]').classList.add('is-invalid');
    // }
    // const emailPattern=/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    // if (!author_email || !emailPattern.test(author_email)) {
    //   document.querySelector('[name=author_email]').classList.add('is-invalid');
    // }
    if (!topic_title || topic_title.length > 30) {
      document.querySelector('[name=topic_title]').classList.add('is-invalid');
    }
    if (!topic_details) {
      document.querySelector('[name=topic_details]').classList.add('is-invalid');
    }
    const allInvalidElems = document.getElementById('DataToBePosted').querySelectorAll('.is-invalid')
    if (allInvalidElems.length) {
      allInvalidElems.forEach((elem) => {
        elem.addEventListener('input', function () {
          this.classList.remove('is-invalid')
        })
      })
      return;
    }
  
  }